# Reusable Collection System

This system provides a simple, reusable way to create live-updating lists for any PocketBase collection using Svelte 5's modern `$state` runes for optimal performance and simplicity.

## Quick Start

### 1. Create a new collection page in 3 lines:

```svelte
<script lang="ts">
	import CollectionList from '$lib/components/CollectionList.svelte';
	import { useCollection } from '$lib/composables/useCollection';
	import type YourType from '$lib/types/YourType';

	const { state, reload } = useCollection<YourType>('your_collection_name');

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'created', label: 'Created', date: true }
	];
</script>

<CollectionList {state} title="Your Items" {columns} onReload={reload} />
```

### 2. For common collections, create a specific composable:

```typescript
// src/lib/composables/useYourCollection.ts
import type YourType from '../types/YourType';
import { useCollection } from './useCollection';

export function useYourCollection(options = {}) {
	return useCollection<YourType>('your_collection', {
		sort: '-created',
		...options
	});
}
```

Then use it:

```svelte
<script lang="ts">
	import { useYourCollection } from '$lib/composables/useYourCollection';

	const { state, reload } = useYourCollection();
</script>

<CollectionList {state} title="Your Items" {columns} onReload={reload} />
```

## Column Configuration

```typescript
const columns = [
	// Basic text column
	{ key: 'name', label: 'Name' },

	// Icon column (shows Iconify icons)
	{ key: 'icon', label: 'Icon', icon: true },

	// Date column (formats dates automatically)
	{ key: 'created', label: 'Created', date: true },

	// Custom render function
	{
		key: 'status',
		label: 'Status',
		render: (item, value) => (value === 'active' ? '✅ Active' : '❌ Inactive')
	},

	// Nested object properties
	{ key: 'user.name', label: 'User Name' }
];
```

## Advanced Usage

### Custom filtering and sorting:

```typescript
const { state, reload } = useCollection<Product>('products', {
	sort: 'name', // Sort by name ascending
	filter: 'status = "active"', // Only active items
	expand: 'category,user' // Expand relations
});
```

### Manual loading control:

```typescript
const { state, load } = useCollection<Product>('products', {
	autoLoad: false // Don't load automatically
});

// Load manually when needed
onMount(() => {
	if (someCondition) {
		load();
	}
});
```

## Features

✅ **Real-time updates** - Automatically syncs with PocketBase changes  
✅ **Loading states** - Shows loading, error, and empty states  
✅ **Responsive design** - Works on desktop and mobile  
✅ **TypeScript support** - Full type safety  
✅ **Easy customization** - Flexible column configuration  
✅ **Reusable** - Write once, use anywhere  
✅ **Error handling** - Graceful error recovery with retry  
✅ **Automatic cleanup** - Properly unsubscribes from real-time updates

## Components & Composables

- **`useCollection<T>(name, options)`** - Core composable for any collection
- **`CollectionList`** - Generic list component with full UI
- **`createCollectionState<T>(name, options)`** - Lower-level state creator using `$state` runes
- **Collection-specific composables** - `useProducts()`, `useRecipes()`, etc.

## Modern Svelte 5 Approach

This system uses Svelte 5's `$state` runes instead of traditional stores for:

✅ **Better Performance** - Direct state mutations are more efficient than store updates  
✅ **Simpler Code** - No need for `$` prefix or store subscriptions  
✅ **Universal Reactivity** - Works in `.svelte.ts` files for shared state  
✅ **Automatic Cleanup** - Runes handle reactivity lifecycle automatically

The state is created in `.svelte.ts` files using:

```typescript
// src/lib/stores/collectionStore.svelte.ts
const state = $state<CollectionState<T>>({
	items: [],
	loading: false,
	error: '',
	initialized: false
});
```

This eliminates the boilerplate code needed for each new collection while maintaining full flexibility, type safety, and modern Svelte 5 best practices.
