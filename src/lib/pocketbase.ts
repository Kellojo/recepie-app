import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { dev } from '$app/environment';

// In Docker deployment, PocketBase serves both the API and the static files
// Use the same host and port as the current location

const pocketBaseDevUrl = 'http://localhost:8080';
const dockerImageUrl = browser ? window.location.origin : pocketBaseDevUrl;
const pocketBaseUrl = dev ? pocketBaseDevUrl : dockerImageUrl;
console.log(`PocketBase initialized with URL: ${pocketBaseUrl}`);

const pb = new PocketBase(pocketBaseUrl);

export default pb;

export enum RecordAction {
	Create = 'create',
	Update = 'update',
	Delete = 'delete'
}
