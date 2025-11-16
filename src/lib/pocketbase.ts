import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

// In Docker deployment, PocketBase serves both the API and the static files
// Use the same host and port as the current location
const pb = new PocketBase(browser ? window.location.origin : 'http://localhost:8080');

export default pb;

export enum RecordAction {
	Create = 'create',
	Update = 'update',
	Delete = 'delete'
}
