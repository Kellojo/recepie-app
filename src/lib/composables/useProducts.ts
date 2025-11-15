import type Product from '../types/Product';
import { useCollection } from './useCollection';

export function useProducts(
	options: {
		sort?: string;
		filter?: string;
		autoLoad?: boolean;
	} = {}
) {
	return useCollection<Product>('products', {
		sort: '-created',
		...options
	});
}
