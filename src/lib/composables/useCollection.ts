import { onMount, onDestroy } from 'svelte';
import { createCollectionState } from '../stores/collectionStore.svelte';

export function useCollection<T extends { id: string }>(
	collectionName: string,
	options: {
		sort?: string;
		filter?: string;
		expand?: string;
		autoLoad?: boolean;
	} = {}
) {
	const { autoLoad = true, ...storeOptions } = options;
	const collection = createCollectionState<T>(collectionName, storeOptions);

	onMount(async () => {
		if (autoLoad) {
			await collection.load();
		}
	});

	onDestroy(() => {
		collection.destroy();
	});

	return {
		state: collection.state,
		load: collection.load
	};
}
