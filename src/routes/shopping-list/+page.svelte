<script lang="ts">
	import GridItem from '$lib/common/GridItem.svelte';
	import { useCollection } from '$lib/composables/useCollection';
	import type ShoppingListItem from '$lib/types/ShoppingListItem';
	import type Product from '$lib/types/Product';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
	import { createRecord, updateRecord, deleteRecord, getRecord } from '$lib/utils/pocketbaseUtils';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';

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

	// Quick add functionality
	function handleQuickAddInput() {
		if (quickAddInput.trim().length > 0) {
			// Filter products that match the input
			const filtered = productsState.items
				.filter((product) => product.name.toLowerCase().includes(quickAddInput.toLowerCase()))
				.slice(0, 5); // Show max 5 suggestions

			suggestions = filtered;
			showSuggestions = filtered.length > 0;
		} else {
			suggestions = [];
			showSuggestions = false;
		}
	}

	async function addProductQuick(product: Product) {
		const existingItem = shoppingState.items.find(
			(item) => item.product === product.id || item.name === product.name
		);

		if (existingItem) {
			await updateRecord('shopping_list', existingItem.id, {
				quantity: existingItem.quantity + 1
			});
		} else {
			await createRecord('shopping_list', {
				name: product.name,
				icon: product.icon,
				quantity: 1,
				product: product.id
			});

			await updateRecord('products', product.id, {
				shoppingCartUsages: product.shoppingCartUsages + 1
			});
		}

		// Don't reload the full list, subscription will handle updates
		quickAddInput = '';
		showSuggestions = false;
	}

	async function addNewItemQuick() {
		if (quickAddInput.trim()) {
			// First create the product
			const newProduct = await createRecord<Product>('products', {
				name: quickAddInput.trim(),
				icon: 'mdi:package-variant',
				shoppingCartUsages: 1
			});

			// Then add it to the shopping list with product reference
			await createRecord('shopping_list', {
				name: newProduct.name,
				quantity: 1,
				icon: newProduct.icon,
				product: newProduct.id
			});

			// Don't reload the full list, subscription will handle updates
			quickAddInput = '';
			showSuggestions = false;
		}
	}

	async function handleQuickAddSubmit(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (suggestions.length > 0) {
				// Add the first suggestion
				await addProductQuick(suggestions[0]);
			} else {
				// Add as new item
				await addNewItemQuick();
			}
		}
	}

	// Quick add state
	let quickAddInput = $state('');
	let suggestions = $state<Product[]>([]);
	let showSuggestions = $state(false);

	async function handleItemClick(item: ShoppingListItem) {
		// Remove item completely from the list
		await deleteRecord('shopping_list', item.id);
		// Don't reload the full list, subscription will handle updates
	}

	async function handleItemAdd(item: ShoppingListItem, e: Event) {
		e.stopPropagation();
		// Increment quantity
		await updateRecord('shopping_list', item.id, {
			quantity: item.quantity + 1
		});
		// Don't reload the full list, subscription will handle updates
		// The collection store will automatically reload this item with expansion
	}

	async function handleItemRemove(item: ShoppingListItem, e: Event) {
		e.stopPropagation();
		// Decrement quantity or delete if quantity becomes 0
		if (item.quantity <= 1) {
			await deleteRecord('shopping_list', item.id);
		} else {
			await updateRecord('shopping_list', item.id, {
				quantity: item.quantity - 1
			});
		}
		// Don't reload the full list, subscription will handle updates
	}
</script>

<div class="shopping-list-page">
	<PageHeader
		title="Shopping List"
		subtitle="{shoppingState.items.length} items on the list"
		searchPlaceholder="Search products..."
	/>

	<!-- Quick Add Bar -->
	<div class="quick-add-section">
		<div class="quick-add-container">
			<input
				type="text"
				placeholder="Add item... (press Enter)"
				bind:value={quickAddInput}
				oninput={handleQuickAddInput}
				onkeydown={handleQuickAddSubmit}
				class="quick-add-input"
			/>
			{#if quickAddInput.trim()}
				<button class="quick-add-btn" onclick={addNewItemQuick}>
					<Icon icon="mdi:plus" />
				</button>
			{/if}

			<!-- Suggestions Overlay -->
			{#if showSuggestions && suggestions.length > 0}
				<div class="suggestions-overlay">
					<div class="suggestions">
						{#each suggestions as product (product.id)}
							<button class="suggestion-item" onclick={() => addProductQuick(product)}>
								<Icon icon={product.icon || 'mdi:package-variant'} />
								<span>{product.name}</span>
								{#if product.shoppingCartUsages > 0}
									<span class="usage">Used {product.shoppingCartUsages} times</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
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
			<h3>Start typing above to add items!</h3>
			<p>Click items to delete them, hover for +/- buttons</p>
		</div>
	{:else}
		<div class="shopping-grid">
			{#each shoppingState.items as item (item.id)}
				<div class="shopping-item">
					<GridItem
						name={getItemName(item)}
						quantity={item.quantity}
						icon={getItemIcon(item)}
						onpress={() => handleItemClick(item)}
					/>
					<div class="item-actions">
						<button
							class="action-btn add-btn"
							onclick={(e) => handleItemAdd(item, e)}
							aria-label="Add one more"
						>
							<Icon icon="mdi:plus" />
						</button>
						<button
							class="action-btn remove-btn"
							onclick={(e) => handleItemRemove(item, e)}
							aria-label="Remove one"
						>
							<Icon icon="mdi:minus" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.quick-add-section {
		margin-bottom: 2rem;
	}

	.quick-add-container {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 1rem;
		position: relative;
	}

	.quick-add-input {
		flex: 1;
		padding: 1rem;
		border: 2px solid var(--borderColor);
		border-radius: 0.5rem;
		background: var(--background);
		color: var(--primaryText);
		font-size: 1rem;
		transition: border-color 0.15s ease;
	}

	.quick-add-input::placeholder {
		color: var(--secondaryText);
		opacity: 0.8;
	}

	.quick-add-input:focus {
		outline: none;
		border-color: var(--borderHoverColor);
		color: var(--primaryText);
	}

	.quick-add-btn {
		padding: 1rem;
		border: none;
		border-radius: 0.5rem;
		background: var(--info);
		color: var(--primaryText);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
	}

	.quick-add-btn:hover {
		background: var(--infoSecondary);
		transform: scale(1.05);
	}

	.suggestions-overlay {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 1000;
		margin-top: 0.5rem;
	}

	.suggestions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--backgroundLight);
		border: 1px solid var(--borderColor);
		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow: var(--shadow-m);
		max-height: 300px;
		overflow-y: auto;
	}

	.suggestion-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: none;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--primaryText);
		cursor: pointer;
		transition: background 0.15s ease;
		text-align: left;
	}

	.suggestion-item:hover {
		background: var(--background);
	}

	.suggestion-item .usage {
		margin-left: auto;
		font-size: 0.75rem;
		color: var(--secondaryText);
	}

	.shopping-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(128px, 128px));
		gap: 1rem;
		padding: 1rem 0;
	}

	.shopping-item {
		position: relative;
		width: 128px;
		height: 128px;
	}

	.item-actions {
		position: absolute;
		top: -8px;
		right: -8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		opacity: 0;
		transition: opacity 0.2s ease;
		z-index: 2;
	}

	.shopping-item:hover .item-actions {
		opacity: 1;
	}

	.action-btn {
		width: 24px;
		height: 24px;
		border: none;
		border-radius: 50%;
		color: var(--primaryText);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-s);
		transition: all 0.15s ease;
		font-size: 14px;
	}

	.add-btn {
		background: var(--success);
	}

	.add-btn:hover {
		background: var(--successSecondary);
		transform: scale(1.1);
	}

	.remove-btn {
		background: var(--error);
	}

	.remove-btn:hover {
		background: var(--errorSecondary);
		transform: scale(1.1);
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
		border: 3px solid var(--borderColor);
		border-top: 3px solid var(--info);
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
		color: var(--primaryText);
	}

	.empty-state p,
	.loading-state p,
	.error-state p {
		margin: 0;
		color: var(--secondaryText);
	}

	.error-state {
		color: var(--error);
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.shopping-list-page {
			padding: 1rem 0.75rem;
		}

		.quick-add-container {
			flex-direction: column;
			gap: 0.75rem;
		}

		.quick-add-btn {
			width: 100%;
		}

		.shopping-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}
	}
</style>
