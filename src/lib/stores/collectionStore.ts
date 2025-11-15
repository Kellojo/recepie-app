import pb, { RecordAction } from '../pocketbase';

export interface CollectionState<T> {
	items: T[];
	loading: boolean;
	error: string;
	initialized: boolean;
}

export function createCollectionState<T extends { id: string }>(
	collectionName: string,
	options: {
		sort?: string;
		filter?: string;
		expand?: string;
	} = {}
) {
	const state = $state<CollectionState<T>>({
		items: [],
		loading: false,
		error: '',
		initialized: false
	});

	let unsubscribe: (() => void) | null = null;

	async function load() {
		state.loading = true;
		state.error = '';

		try {
			const result = await pb.collection(collectionName).getFullList<T>({
				sort: options.sort || '-created',
				filter: options.filter || '',
				expand: options.expand || ''
			});

			state.items = result;
			state.loading = false;
			state.initialized = true;

			// Set up real-time subscription after successful load
			if (!unsubscribe) {
				try {
					unsubscribe = await pb.collection(collectionName).subscribe('*', handleRealtimeUpdate);
					console.log(`Successfully subscribed to ${collectionName} collection`);
				} catch (err) {
					console.warn(`Failed to subscribe to ${collectionName}:`, err);
				}
			}
		} catch (err: any) {
			state.error = err.message || `Failed to load ${collectionName}`;
			state.loading = false;
			console.error(`Error loading ${collectionName}:`, err);
		}
	}

	function handleRealtimeUpdate(data: any) {
		const record = data.record as T;

		switch (data.action) {
			case RecordAction.Create:
				// Add to beginning if sorting by -created, otherwise end
				if (options.sort?.startsWith('-')) {
					state.items = [record, ...state.items];
				} else {
					state.items = [...state.items, record];
				}
				break;
			case RecordAction.Update:
				state.items = state.items.map((item) => (item.id === record.id ? record : item));
				break;
			case RecordAction.Delete:
				state.items = state.items.filter((item) => item.id !== record.id);
				break;
		}
	}

	function destroy() {
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}
	}

	return {
		get state() {
			return state;
		},
		load,
		reload: load,
		destroy
	};
}
