import pb from '../pocketbase';

export async function createRecord<T>(collection: string, data: Partial<T>): Promise<T> {
	return await pb.collection(collection).create(data);
}

export async function updateRecord<T>(
	collection: string,
	id: string,
	data: Partial<T>
): Promise<T> {
	return await pb.collection(collection).update(id, data);
}

export async function deleteRecord(collection: string, id: string): Promise<void> {
	await pb.collection(collection).delete(id);
}

export async function getRecord<T>(collection: string, id: string): Promise<T> {
	return await pb.collection(collection).getOne(id);
}

export async function listRecords<T>(
	collection: string,
	options: {
		page?: number;
		perPage?: number;
		sort?: string;
		filter?: string;
		expand?: string;
	} = {}
): Promise<{ items: T[]; totalItems: number; totalPages: number }> {
	const result = await pb.collection(collection).getList(options.page || 1, options.perPage || 30, {
		sort: options.sort || '-created',
		filter: options.filter,
		expand: options.expand
	});

	return {
		items: result.items,
		totalItems: result.totalItems,
		totalPages: result.totalPages
	};
}
