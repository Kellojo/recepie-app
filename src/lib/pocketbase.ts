import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

export default pb;

export enum RecordAction {
	Create = 'create',
	Update = 'update',
	Delete = 'delete'
}
