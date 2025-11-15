<script lang="ts">
	import GridItem from '$lib/common/GridItem.svelte';
	import { useCollection } from '$lib/composables/useCollection';
	import type ShoppingListItem from '$lib/types/ShoppingListItem';
	import type Product from '$lib/types/Product';
	import ProductSelectionDialog from '$lib/components/ProductSelectionDialog.svelte';
	import ShoppingListItemDialog from '$lib/components/ShoppingListItemDialog.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
	import { createRecord, updateRecord, deleteRecord } from '$lib/utils/pocketbaseUtils';

	// Use the real collection system with product expansion
	const { state: shoppingState, load: loadShoppingList } = useCollection<ShoppingListItem>(
		'shopping_list',
		{
			expand: 'product'
		}
	);
	const { state: productsState } = useCollection<Product>('products');

	// Helper functions for grid items
	function getItemIcon(item: ShoppingListItem): string {
		return item.expand?.product?.icon || item.icon || 'mdi:package-variant';
	}

	function getItemName(item: ShoppingListItem): string {
		return item.expand?.product?.name || item.name || 'Unknown Item';
	}

	// Dialog states
	let showProductSelection = $state(false);
	let showItemDialog = $state(false);
	let editingItem = $state<ShoppingListItem | null>(null);

	function handleItemClick(item: ShoppingListItem) {
		editingItem = item;
		showItemDialog = true;
	}

	async function handleAddFromProducts() {
		showProductSelection = true;
	}

	async function handleProductSelected(event: CustomEvent<{ product: Product; quantity: number }>) {
		const { product, quantity } = event.detail;

		// Check if product already exists in shopping list (by product ID or name)
		const existingItem = shoppingState.items.find(
			(item) => item.product === product.id || item.name === product.name
		);

		if (existingItem) {
			// Update existing quantity
			await updateRecord('shopping_list', existingItem.id, {
				quantity: existingItem.quantity + quantity
			});
			await loadShoppingList();
		} else {
			// Create new shopping list item with product relationship
			await createRecord('shopping_list', {
				name: product.name,
				icon: product.icon,
				quantity,
				product: product.id // Create relationship to product
			});
			await loadShoppingList();

			// Update product usage count
			await updateRecord('products', product.id, {
				shoppingCartUsages: product.shoppingCartUsages + 1
			});
		}

		showProductSelection = false;
	}

	async function handleCreateNewProduct() {
		showProductSelection = false;
		editingItem = null;
		showItemDialog = true;
	}

	async function handleItemSave(event: CustomEvent<{ item: Partial<ShoppingListItem> }>) {
		const { item } = event.detail;

		if (editingItem) {
			// Update existing item
			await updateRecord('shopping_list', editingItem.id, item);
		} else {
			// Create new item
			await createRecord('shopping_list', item);
		}
		await loadShoppingList();

		showItemDialog = false;
		editingItem = null;
	}

	async function handleItemDelete(event: CustomEvent<{ id: string }>) {
		await deleteRecord('shopping_list', event.detail.id);
		await loadShoppingList();
		showItemDialog = false;
		editingItem = null;
	}

	function handleItemCancel() {
		showItemDialog = false;
		editingItem = null;
	}

	function handleProductSelectionCancel() {
		showProductSelection = false;
	}
</script>

<div class="shopping-list-page">
	<div class="page-header">
		<h1>Shopping List</h1>
		<div class="header-actions">
			<Button variant="emphasized" onclick={handleAddFromProducts}>
				<Icon icon="mdi:plus" />
				Add Products
			</Button>
		</div>
	</div>

	{#if shoppingState.loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading shopping list...</p>
		</div>
	{:else if shoppingState.error}
		<div class="error-state">
			<Icon icon="mdi:alert-circle" width="48" height="48" />
			<p>Error: {shoppingState.error}</p>
		</div>
	{:else if shoppingState.items.length === 0}
		<div class="empty-state">
			<Icon icon="mdi:cart-outline" width="64" height="64" />
			<h3>Your shopping list is empty</h3>
			<p>Add some products to get started!</p>
			<Button variant="emphasized" onclick={handleAddFromProducts}>
				<Icon icon="mdi:plus" />
				Add First Product
			</Button>
		</div>
	{:else}
		<div class="shopping-grid">
			{#each shoppingState.items as item (item.id)}
				<GridItem
					name={getItemName(item)}
					quantity={item.quantity}
					icon={getItemIcon(item)}
					onpress={() => handleItemClick(item)}
				/>
			{/each}
		</div>
	{/if}

	<!-- Fixed add button for mobile -->
	<button class="fab" onclick={handleAddFromProducts} aria-label="Add products">
		<Icon icon="mdi:plus" width="24" height="24" />
	</button>
</div>

<!-- Product Selection Dialog -->
<ProductSelectionDialog
	bind:isOpen={showProductSelection}
	{productsState}
	on:select={handleProductSelected}
	on:createnewproduct={handleCreateNewProduct}
	on:cancel={handleProductSelectionCancel}
/>

<!-- Shopping List Item Dialog -->
<ShoppingListItemDialog
	bind:isOpen={showItemDialog}
	item={editingItem}
	mode={editingItem ? 'edit' : 'create'}
	on:save={handleItemSave}
	on:delete={handleItemDelete}
	on:cancel={handleItemCancel}
/>

<style>
	.shopping-list-page {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
	}

	.page-header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	.shopping-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
		gap: 1rem;
		padding: 1rem 0;
	}

	.loading-state,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 1rem;
		text-align: center;
		min-height: 300px;
	}

	.loading-state .spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-color);
		border-top: 3px solid var(--accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-primary);
	}

	.empty-state p,
	.loading-state p,
	.error-state p {
		margin: 0;
		color: var(--text-secondary);
	}

	.error-state {
		color: var(--error);
	}

	.fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 56px;
		height: 56px;
		border: none;
		border-radius: 50%;
		background: var(--accent);
		color: white;
		box-shadow: var(--shadow-lg);
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.fab:hover {
		transform: scale(1.1);
		box-shadow: var(--shadow-xl);
	}

	.fab:active {
		transform: scale(1.05);
	}

	/* Hide FAB on desktop when header actions are visible */
	@media (min-width: 640px) {
		.fab {
			display: none;
		}
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.page-header h1 {
			font-size: 1.5rem;
			text-align: center;
		}

		.header-actions {
			display: none; /* Show FAB instead */
		}
	}
</style>
