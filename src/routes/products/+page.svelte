<script lang="ts">
	import ProductDialog from '$lib/components/ProductDialog.svelte';
	import ListItem from '$lib/components/ui/ListItem.svelte';
	import Loadingspinner from '$lib/components/ui/Loadingspinner.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SearchField from '$lib/components/ui/SearchField.svelte';
	import { formatTimeAgo } from '$lib/formatter/dateFormatters';
	import PocketBaseCollection, { PocketBaseCollectionAction } from '$lib/pocketbaseCollection';
	import type Product from '$lib/types/Product';
	import Icon from '@iconify/svelte';
	import type { RecordModel, RecordSubscription } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';

	const collection = new PocketBaseCollection<Product>({
		name: 'products',
		sort: '-shoppingCartUsages, name',
		onChange: onCollectionChange
	});

	let searchQuery = $state('');
	let isLoading = $state(true);
	let products = $state<Product[]>([]);

	let selectedProduct: Product | null = $state(null);
	let dialogOpen = $state(false);
	let dialogMode: 'create' | 'edit' = $state('create');

	onMount(() => {
		collection.onMount();
		getAllRecords();
	});
	onDestroy(collection.onDestroy);

	async function getAllRecords(suppressLoading: boolean = false): Promise<void> {
		if (!suppressLoading) isLoading = true;
		products = await collection.getAllRecords(`name ~ "${searchQuery}"`);
		isLoading = false;
	}
	async function onCollectionChange(
		change: RecordSubscription<RecordModel>,
		record: Product | null
	) {
		if (change.action === PocketBaseCollectionAction.CREATE) {
			products = [record!, ...products];
			getAllRecords();
		} else if (change.action === PocketBaseCollectionAction.UPDATE) {
			products = products.map((product) => (product.id === change.record.id ? record! : product));
			getAllRecords();
		} else if (change.action === PocketBaseCollectionAction.DELETE) {
			products = products.filter((product) => product.id !== change.record.id);
		}
	}

	function openCreateDialog() {
		selectedProduct = null;
		dialogMode = 'create';
		dialogOpen = true;
	}
	function onItemPressed(product: Product) {
		selectedProduct = product;
		dialogMode = 'edit';
		dialogOpen = true;
	}
	async function onSave(product: Partial<Product>) {
		collection.saveRecord(product);
		dialogOpen = false;
		selectedProduct = null;
	}
	async function onDelete(id: string) {
		collection.deleteRecord(id);

		dialogOpen = false;
		selectedProduct = null;
	}
	function onCloseDialog() {
		dialogOpen = false;
		selectedProduct = null;
	}
</script>

{#snippet searchField()}
	<SearchField
		bind:value={searchQuery}
		onsearch={() => getAllRecords(true)}
		placeholder="Search products..."
	/>
{/snippet}

<PageHeader
	title="Products"
	subtitle="{products.length} products found"
	buttonText="Add Product"
	buttonIcon="mdi:plus"
	onButtonClick={openCreateDialog}
	buttonDisabled={isLoading}
	{searchField}
></PageHeader>

<div class="list">
	<div class="header item">
		<div class="primary">Product</div>
		<div class="primary"></div>
		<div class="primary">Used</div>
		<div class="primary">Last Updated</div>
	</div>

	{#if isLoading}
		<div class="loading">
			<Loadingspinner />
		</div>
	{:else if products.length === 0}
		<div class="no-data">
			{#if searchQuery}
				<p>No products found for "{searchQuery}".</p>
			{:else}
				<p>No products found.</p>
			{/if}
		</div>
	{:else}
		{#each products as product}
			<ListItem entity={product} {onItemPressed} gridTemplateColumns="24px 3fr 1fr 1fr">
				<div class="icon">
					<Icon icon={product.icon || 'noto:package'} width="24px" height="24px" />
				</div>
				<div class="primary bold">{product.name}</div>
				<div class="primary">{product.shoppingCartUsages}</div>
				<div class="secondary">{formatTimeAgo(product.updated)}</div>
			</ListItem>
		{/each}
	{/if}
</div>

<ProductDialog
	bind:isOpen={dialogOpen}
	product={selectedProduct}
	mode={dialogMode}
	onsave={onSave}
	ondelete={onDelete}
	oncancel={onCloseDialog}
/>

<style>
	.list {
		border-radius: 0.5rem;
		border: 2px solid var(--borderColor);
		box-shadow: var(--shadow-s);
	}

	.header {
		background-color: var(--backgroundLight) !important;
		border-bottom: 1px solid var(--borderColor);
		grid-template-columns: 24px 3fr 1fr 1fr;
		display: grid;
		gap: 1rem;
		padding: 1rem;
		cursor: default !important;
	}

	.no-data,
	.loading {
		padding: 2rem;
		text-align: center;
		color: var(--secondaryText);
		overflow: hidden;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bold {
		font-weight: bold;
	}

	.primary {
		color: var(--primaryText);
	}

	.secondary {
		color: var(--secondaryText);
	}
</style>
