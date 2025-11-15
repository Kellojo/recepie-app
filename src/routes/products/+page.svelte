<script lang="ts">
	import CollectionList from '$lib/components/CollectionList.svelte';
	import ProductDialog from '$lib/components/ProductDialog.svelte';
	import Icon from '@iconify/svelte';
	import { useProducts } from '$lib/composables/useProducts';
	import pb from '$lib/pocketbase';
	import type Product from '$lib/types/Product';

	const { state: productsState, load } = useProducts();

	// Dialog state
	let dialogOpen = $state(false);
	let dialogMode: 'create' | 'edit' = $state('create');
	let selectedProduct: Product | null = $state(null);
	let isLoading = $state(false);

	// Table configuration
	const columns = [
		{ key: 'icon', label: 'Icon', icon: true, width: '10%', minWidth: '60px' },
		{ key: 'name', label: 'Name', width: '60%', minWidth: '200px' },
		{ key: 'updated', label: 'Updated', date: true, width: '30%', minWidth: '150px' }
	];

	function openCreateDialog() {
		selectedProduct = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function editProduct(product: Product) {
		selectedProduct = product;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	async function handleSave(event: CustomEvent<{ product: Partial<Product> }>) {
		isLoading = true;
		try {
			const productData = event.detail.product;

			if (dialogMode === 'create') {
				await pb.collection('products').create(productData);
			} else if (dialogMode === 'edit' && selectedProduct) {
				await pb.collection('products').update(selectedProduct.id, productData);
			}

			dialogOpen = false;
			await load(); // Refresh the list
		} catch (error) {
			console.error('Error saving product:', error);
			// You could add toast notifications here
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(event: CustomEvent<{ id: string }>) {
		isLoading = true;
		try {
			await pb.collection('products').delete(event.detail.id);
			dialogOpen = false;
			await load(); // Refresh the list
		} catch (error) {
			console.error('Error deleting product:', error);
			// You could add toast notifications here
		} finally {
			isLoading = false;
		}
	}

	function handleCancel() {
		dialogOpen = false;
		selectedProduct = null;
	}
</script>

<div class="products-page">
	<div class="page-header">
		<h1>Products</h1>
		<button class="add-button" onclick={openCreateDialog} disabled={isLoading}>
			<Icon icon="mdi:plus" width="20" height="20" />
			Add Product
		</button>
	</div>

	<CollectionList
		state={productsState}
		{columns}
		emptyMessage="No products found. Click 'Add Product' to create your first product."
		onRowClick={editProduct}
	/>
</div>

<ProductDialog
	bind:isOpen={dialogOpen}
	product={selectedProduct}
	mode={dialogMode}
	on:save={handleSave}
	on:delete={handleDelete}
	on:cancel={handleCancel}
/>

<style>
	.products-page {
		width: 100%;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--borderColor);
	}

	.page-header h1 {
		margin: 0;
		color: var(--primaryText);
		font-size: 1.75rem;
		font-weight: 600;
	}

	.add-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--info);
		border: none;
		color: var(--primaryText);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-s);
	}

	.add-button:hover:not(:disabled) {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
		transform: translateY(-1px);
	}

	.add-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--shadow-s);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.page-header h1 {
			font-size: 1.5rem;
		}

		.add-button {
			align-self: stretch;
			justify-content: center;
		}
	}
</style>
