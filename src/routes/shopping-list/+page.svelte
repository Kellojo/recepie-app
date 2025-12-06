<script lang="ts">
	import ProductDialog from '$lib/components/ProductDialog.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import ListItem from '$lib/components/ui/ListItem.svelte';
	import Loadingspinner from '$lib/components/ui/Loadingspinner.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SearchField from '$lib/components/ui/SearchField.svelte';
	import { formatTimeAgo } from '$lib/formatter/dateFormatters';
	import PocketBaseCollection, { PocketBaseCollectionAction } from '$lib/pocketbaseCollection';
	import type Product from '$lib/types/Product';
	import type ShoppingListItem from '$lib/types/ShoppingListItem';
	import Icon from '@iconify/svelte';
	import type { RecordModel, RecordSubscription } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';

	const collection = new PocketBaseCollection<ShoppingListItem>({
		name: 'shopping_list',
		sort: '-created',
		expand: 'product',
		onChange: onCollectionChange
	});

	let suggestedProducts = $state<Product[]>([]);
	const productCollection = new PocketBaseCollection<Product>({
		name: 'products',
		sort: 'name,shoppingCartUsages',
		onChange: async (change: RecordSubscription<RecordModel>, record: Product | null) => {}
	});

	let searchQuery = $state('');

	let isLoading = $state(true);
	let items = $state<ShoppingListItem[]>([]);

	let selectedItem: ShoppingListItem | null = $state(null);
	let dialogOpen = $state(false);
	let dialogMode: 'create' | 'edit' = $state('create');

	onMount(() => {
		collection.onMount();
		getAllRecords();
	});
	onDestroy(collection.onDestroy);

	async function getAllRecords(suppressLoading: boolean = false): Promise<void> {
		if (!suppressLoading) isLoading = true;
		items = await collection.getAllRecords('');
		isLoading = false;
	}
	async function onCollectionChange(
		change: RecordSubscription<RecordModel>,
		record: ShoppingListItem | null
	) {
		if (change.action === PocketBaseCollectionAction.CREATE) {
			items = [record!, ...items];
			getAllRecords();
		} else if (change.action === PocketBaseCollectionAction.UPDATE) {
			items = items.map((item) => (item.id === change.record.id ? record! : item));
			getAllRecords();
		} else if (change.action === PocketBaseCollectionAction.DELETE) {
			items = items.filter((item) => item.id !== change.record.id);
		}
	}

	function openCreateDialog() {
		selectedItem = null;
		dialogMode = 'create';
		dialogOpen = true;
	}
	function onItemPressed(item: ShoppingListItem) {
		selectedItem = item;
		dialogMode = 'edit';
		dialogOpen = true;
	}
	async function onSave(item: Partial<ShoppingListItem>) {
		collection.saveRecord(item);
		dialogOpen = false;
		selectedItem = null;
	}
	async function onDelete(id: string) {
		collection.deleteRecord(id);

		dialogOpen = false;
		selectedItem = null;
	}
	function onCloseDialog() {
		dialogOpen = false;
		selectedItem = null;
	}
</script>

{#snippet suggestions()}
	{#each suggestedProducts as product}
		<ListItem gridTemplateColumns="24px 1fr 5rem">
			<div class="icon">
				<Icon icon={product.icon || 'noto:package'} width="24px" height="24px" />
			</div>
			<div class="primary">{product.name}</div>
			<div class="secondary">{product.shoppingCartUsages} usages</div>
		</ListItem>
	{/each}

	<ListItem gridTemplateColumns="1fr">
		<div class="primary">Add '{searchQuery}'</div>
	</ListItem>
{/snippet}

{#snippet searchField()}
	<SearchField
		bind:value={searchQuery}
		onsearch={() => getAllRecords(true)}
		placeholder="Add to shopping list..."
		{suggestions}
	/>
{/snippet}

<PageHeader title="Shopping List" subtitle="{items.length} items found" {searchField} />

<div class="list">
	<div class="header item">
		<div class="primary"></div>
		<div class="primary">Product</div>
		<div class="primary"></div>
		<div class="primary">Quantity</div>
		<div class="primary">Added</div>
	</div>

	{#if isLoading}
		<div class="loading">
			<Loadingspinner />
		</div>
	{:else if items.length === 0}
		<div class="no-data">
			<p>No items found.</p>
		</div>
	{:else}
		{#each items as item}
			<ListItem entity={item} {onItemPressed} gridTemplateColumns="2.5rem 24px 3fr 1fr 1fr">
				<Checkbox onChange={() => onDelete(item.id)} />
				<div class="icon">
					<Icon icon={item.expand?.product?.icon || 'noto:package'} width="24px" height="24px" />
				</div>
				<div class="primary bold">{item.expand?.product?.name}</div>
				<div class="primary">{item.quantity}</div>
				<div class="secondary">{formatTimeAgo(item.created)}</div>
			</ListItem>
		{/each}
	{/if}
</div>

<style>
	.list {
		border-radius: 0.5rem;
		border: 2px solid var(--borderColor);
		box-shadow: var(--shadow-s);
	}

	.header {
		background-color: var(--backgroundLight) !important;
		border-bottom: 1px solid var(--borderColor);
		grid-template-columns: 2.5rem 24px 3fr 1fr 1fr;
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
