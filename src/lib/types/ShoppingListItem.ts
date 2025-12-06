import type Product from './Product';

export default interface ShoppingListItem {
	id: string;
	quantity: number;
	product?: string; // Product ID
	expand?: {
		product?: Product;
	};
	created: string;
	updated: string;
}
