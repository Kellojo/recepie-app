import type { RecordModel, RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import pb from './pocketbase';

export default class PocketBaseCollection<T extends PocketBaseRecord> {
	private unsubscribe: UnsubscribeFunc | null = null;
	private name: string;
	private sort: string | undefined;
	private expand: string | undefined;
	private onChange: (change: RecordSubscription<RecordModel>, record: T | null) => Promise<void>;

	constructor({ name, sort, expand, onChange }: PocketBaseCollectionOptions<T>) {
		this.name = name;
		this.sort = sort;
		this.expand = expand;
		this.onChange = onChange;
	}
	public onMount() {
		this.subscribeToChanges();
	}
	public onDestroy() {
		this?.unsubscribeFromChanges();
	}

	private async subscribeToChanges() {
		this.unsubscribe = await pb
			.collection(this.name)
			.subscribe('*', this.onCollectionChange.bind(this));
	}
	private unsubscribeFromChanges() {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
	}

	async onCollectionChange(event: RecordSubscription<RecordModel>) {
		console.log(`Collection ${event.action} detected.`);

		let record: T | null = null;
		if (
			event.action === PocketBaseCollectionAction.CREATE ||
			event.action === PocketBaseCollectionAction.UPDATE
		) {
			record = await this.getRecord(event.record.id);
		}

		this.onChange(event, record);
	}

	public async getRecord(id: string): Promise<T> {
		return await pb.collection(this.name).getOne(id);
	}
	public async getAllRecords(searchQuery: string | undefined): Promise<T[]> {
		return await pb.collection(this.name).getFullList({
			sort: this.sort,
			filter: searchQuery || undefined,
			expand: this.expand
		});
	}

	public async saveRecord(data: Partial<T> & { id?: string }): Promise<T> {
		if (data.id) {
			return await this.updateRecord(data.id, data);
		} else {
			return await this.createRecord(data);
		}
	}

	public async createRecord(data: Partial<T>): Promise<T> {
		return await pb.collection(this.name).create(data);
	}
	public async updateRecord(id: string, data: Partial<T>): Promise<T> {
		return await pb.collection(this.name).update(id, data);
	}
	public async deleteRecord(id: string): Promise<void> {
		await pb.collection(this.name).delete(id);
	}
}

export interface PocketBaseCollectionOptions<T> {
	name: string;
	sort: string | undefined;
	onChange: (change: RecordSubscription<RecordModel>, record: T | null) => Promise<void>;
	expand?: string;
}

export interface PocketBaseRecord {
	id: string;
	created: string;
	updated: string;
}

export enum PocketBaseCollectionAction {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete'
}
