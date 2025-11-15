<script lang="ts">
	import CollectionGrid from '$lib/components/CollectionGrid.svelte';
	import { useCollection } from '$lib/composables/useCollection';
	import type ShoppingListItem from '$lib/types/ShoppingListItem';

	// Use the real collection system
	const { state: shoppingState } = useCollection<ShoppingListItem>('shopping_list_items');

	// Grid field configuration
	const fields = [
		{ key: 'icon', icon: true },
		{ key: 'name', primary: true },
		{ key: 'quantity', label: 'Qty', badge: true },
		{ key: 'created', label: 'Added', date: true, secondary: true }
	];

	function handleItemClick(item: ShoppingListItem) {
		console.log('Clicked item:', item);
		// You could navigate to an edit page, show a modal, etc.
	}
</script>

<CollectionGrid
	state={shoppingState}
	title="Shopping List"
	{fields}
	emptyMessage="No items in your shopping list. Add some items in PocketBase admin panel."
	minCardWidth="240px"
	onClick={handleItemClick}
/>
