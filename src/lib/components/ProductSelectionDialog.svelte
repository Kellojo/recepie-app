<script lang="ts">
	import type Product from '../types/Product';
	import type { CollectionState } from '../stores/collectionStore';
	import { createEventDispatcher } from 'svelte';
	import Dialog from './ui/Dialog.svelte';
	import Button from './ui/Button.svelte';
	import Input from './ui/Input.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		isOpen: boolean;
		productsState: CollectionState<Product>;
	}

	let { isOpen = $bindable(), productsState }: Props = $props();

	const dispatch = createEventDispatcher<{
		select: { product: Product; quantity: number };
		createnewproduct: void;
		cancel: void;
	}>();

	// Search and selection state
	let searchQuery = $state('');
	let selectedProduct = $state<Product | null>(null);
	let quantity = $state(1);

	// Filter products based on search
	const filteredProducts = $derived.by(() => {
		if (!searchQuery.trim()) {
			return productsState.items
				.slice()
				.sort((a, b) => b.shoppingCartUsages - a.shoppingCartUsages);
		}

		const query = searchQuery.toLowerCase();
		return productsState.items
			.filter((product) => product.name.toLowerCase().includes(query))
			.sort((a, b) => b.shoppingCartUsages - a.shoppingCartUsages);
	});

	// Reset state when dialog opens/closes
	$effect(() => {
		if (isOpen) {
			searchQuery = '';
			selectedProduct = null;
			quantity = 1;
		}
	});

	function handleProductSelect(product: Product) {
		selectedProduct = product;
	}

	function handleAddToList() {
		if (selectedProduct) {
			dispatch('select', { product: selectedProduct, quantity });
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleCreateNew() {
		dispatch('createnewproduct');
	}

	function increaseQuantity() {
		quantity++;
	}

	function decreaseQuantity() {
		if (quantity > 1) {
			quantity--;
		}
	}
</script>

<Dialog bind:isOpen title="Add Products to Shopping List">
	{#snippet children()}
		<div class="product-selection">
			<!-- Search Bar -->
			<div class="search-section">
				<Input label="Search products" bind:value={searchQuery} placeholder="Search by name..." />
			</div>

			<!-- Product Grid -->
			<div class="products-section">
				<div class="section-header">
					<h3>Select a Product</h3>
					<Button variant="default" onclick={handleCreateNew}>
						<Icon icon="mdi:plus" />
						Create New
					</Button>
				</div>

				{#if productsState.loading}
					<div class="loading-state">
						<div class="spinner"></div>
						<p>Loading products...</p>
					</div>
				{:else if filteredProducts.length === 0}
					<div class="empty-state">
						<Icon icon="mdi:package-variant" width="48" height="48" />
						<p>
							{searchQuery ? 'No products found matching your search.' : 'No products available.'}
						</p>
						<Button variant="emphasized" onclick={handleCreateNew}>
							<Icon icon="mdi:plus" />
							Create First Product
						</Button>
					</div>
				{:else}
					<div class="products-grid">
						{#each filteredProducts as product (product.id)}
							<button
								class="product-card"
								class:selected={selectedProduct?.id === product.id}
								onclick={() => handleProductSelect(product)}
							>
								<div class="product-icon">
									<Icon icon={product.icon || 'mdi:package-variant'} width="32" height="32" />
								</div>
								<div class="product-info">
									<h4 class="product-name">{product.name}</h4>
									<div class="product-meta">
										<span class="usage-count">
											<Icon icon="mdi:cart" width="14" height="14" />
											{product.shoppingCartUsages} times
										</span>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Quantity Selection -->
			{#if selectedProduct}
				<div class="quantity-section">
					<h3>Quantity</h3>
					<div class="quantity-controls">
						<button
							class="quantity-btn"
							onclick={decreaseQuantity}
							disabled={quantity <= 1}
							aria-label="Decrease quantity"
						>
							<Icon icon="mdi:minus" />
						</button>
						<span class="quantity-display">{quantity}</span>
						<button class="quantity-btn" onclick={increaseQuantity} aria-label="Increase quantity">
							<Icon icon="mdi:plus" />
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/snippet}

	{#snippet actions()}
		<Button variant="default" onclick={handleCancel}>Cancel</Button>
		<Button variant="emphasized" onclick={handleAddToList} disabled={!selectedProduct}>
			<Icon icon="mdi:cart-plus" />
			Add to Shopping List
		</Button>
	{/snippet}
</Dialog>

<style>
	.product-selection {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-height: 400px;
		max-height: 70vh;
	}

	.search-section {
		flex-shrink: 0;
	}

	.products-section {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.section-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary);
	}

	.spinner {
		width: 32px;
		height: 32px;
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

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
		overflow-y: auto;
		max-height: 300px;
		padding: 0.5rem;
		scrollbar-gutter: stable;
	}

	.product-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		background: var(--surface);
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.product-card:hover {
		border-color: var(--accent);
		box-shadow: var(--shadow-sm);
	}

	.product-card.selected {
		border-color: var(--accent);
		background: var(--accent-bg);
		box-shadow: var(--shadow-sm);
	}

	.product-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent);
	}

	.product-info {
		flex: 1;
		min-width: 0;
	}

	.product-name {
		margin: 0 0 0.25rem 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.usage-count {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.quantity-section {
		flex-shrink: 0;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.quantity-section h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.quantity-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.quantity-btn:hover:not(:disabled) {
		border-color: var(--accent);
		background: var(--accent-bg);
	}

	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity-display {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		min-width: 2rem;
		text-align: center;
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		.products-grid {
			grid-template-columns: 1fr;
		}

		.section-header {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.product-card {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}

		.product-info {
			text-align: center;
		}
	}
</style>
