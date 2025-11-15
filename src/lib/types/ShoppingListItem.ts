import type Product from './Product';

export default interface ShoppingListItem {
	id: string;
	name: string;
	quantity: number;
	icon?: string;
	product?: string; // Product ID
	expand?: {
		product?: Product;
	};
	created: string;
	updated: string;
}
