<script lang="ts">
	import CollectionList from '$lib/components/CollectionList.svelte';
	import ProductDialog from '$lib/components/ProductDialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { useProducts } from '$lib/composables/useProducts';
	import pb from '$lib/pocketbase';
	import type Product from '$lib/types/Product';

	// Search state
	let searchQuery = $state('');

	const { state: productsState, load } = useProducts();

	// Create a derived state that mimics the original state but with filtered items
	const filteredState = $derived.by(() => {
		const filteredItems = searchQuery.trim()
			? productsState.items.filter((product) =>
					product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
				)
			: productsState.items;

		return {
			...productsState,
			items: filteredItems
		};
	});

	// Dialog state
	let dialogOpen = $state(false);
	let dialogMode: 'create' | 'edit' = $state('create');
	let selectedProduct: Product | null = $state(null);
	let isLoading = $state(false);

	// Table configuration
	const columns = [
		{ key: 'icon', label: 'Icon', icon: true, width: '10%', minWidth: '60px' },
		{ key: 'name', label: 'Name', width: '60%', minWidth: '200px' },
		{ key: 'shoppingCartUsages', label: 'Usages', width: '250px', minWidth: '200px' },
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
	<PageHeader
		title="Products"
		subtitle="Manage your product inventory"
		buttonText="Add Product"
		buttonIcon="mdi:plus"
		onButtonClick={openCreateDialog}
		buttonDisabled={isLoading}
		showSearch={true}
		bind:searchValue={searchQuery}
		searchPlaceholder="Search products..."
	/>

	<CollectionList
		state={filteredState}
		{columns}
		emptyMessage={searchQuery.trim()
			? `No products found matching "${searchQuery.trim()}".`
			: "No products found. Click 'Add Product' to create your first product."}
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
</style>
