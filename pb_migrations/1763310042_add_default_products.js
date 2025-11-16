/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const defaultProducts = [
			// Fruits
			['Apples', 'mdi:apple', 0],
			['Bananas', 'mdi:food-banana', 0],
			['Oranges', 'mdi:fruit-citrus', 0],
			['Lemons', 'mdi:fruit-citrus', 0],
			['Strawberries', 'mdi:fruit-cherries', 0],
			['Blueberries', 'mdi:fruit-grapes', 0],

			// Vegetables
			['Tomatoes', 'mdi:food-apple', 0],
			['Onions', 'mdi:food-variant', 0],
			['Garlic', 'mdi:food-variant', 0],
			['Carrots', 'mdi:carrot', 0],
			['Potatoes', 'mdi:food-variant', 0],
			['Bell Peppers', 'mdi:food-variant', 0],
			['Mushrooms', 'mdi:mushroom', 0],
			['Spinach', 'mdi:leaf', 0],
			['Lettuce', 'mdi:leaf', 0],

			// Meat & Protein
			['Chicken Breast', 'mdi:food-drumstick', 0],
			['Ground Beef', 'mdi:food-steak', 0],
			['Salmon', 'mdi:fish', 0],
			['Eggs', 'mdi:egg', 0],
			['Tofu', 'mdi:cube-outline', 0],

			// Dairy
			['Milk', 'mdi:cup', 0],
			['Cheese', 'mdi:cheese', 0],
			['Butter', 'mdi:butter', 0],
			['Greek Yogurt', 'mdi:cup', 0],

			// Grains & Bread
			['Rice', 'mdi:rice', 0],
			['Pasta', 'mdi:pasta', 0],
			['Bread', 'mdi:baguette', 0],
			['Oats', 'mdi:grain', 0],
			['Quinoa', 'mdi:grain', 0],

			// Pantry Staples
			['Olive Oil', 'mdi:bottle-tonic', 0],
			['Salt', 'mdi:shaker-outline', 0],
			['Black Pepper', 'mdi:shaker-outline', 0],
			['Sugar', 'mdi:cube-outline', 0],
			['Flour', 'mdi:sack', 0],
			['Baking Powder', 'mdi:powder', 0],
			['Vanilla Extract', 'mdi:bottle-tonic-outline', 0],

			// Herbs & Spices
			['Basil', 'mdi:leaf', 0],
			['Oregano', 'mdi:leaf', 0],
			['Thyme', 'mdi:leaf', 0],
			['Rosemary', 'mdi:leaf', 0],
			['Paprika', 'mdi:shaker-outline', 0],
			['Cumin', 'mdi:shaker-outline', 0],

			// Canned/Packaged
			['Canned Tomatoes', 'mdi:can', 0],
			['Coconut Milk', 'mdi:bottle-tonic', 0],
			['Chicken Broth', 'mdi:bottle-tonic', 0],
			['Black Beans', 'mdi:can', 0],
			['Chickpeas', 'mdi:can', 0],

			// Condiments & Sauces
			['Soy Sauce', 'mdi:bottle-tonic-outline', 0],
			['Hot Sauce', 'mdi:bottle-tonic-outline', 0],
			['Mayonnaise', 'mdi:bottle-tonic-outline', 0],
			['Ketchup', 'mdi:bottle-tonic-outline', 0],
			['Mustard', 'mdi:bottle-tonic-outline', 0],

			// Beverages
			['Coffee', 'mdi:coffee', 0],
			['Tea', 'mdi:tea', 0],
			['Orange Juice', 'mdi:cup', 0],

			// Snacks
			['Almonds', 'mdi:nut', 0],
			['Peanut Butter', 'mdi:peanut', 0],
			['Dark Chocolate', 'mdi:candy', 0]
		];

		// Insert default products using SQL
		defaultProducts.forEach((product) => {
			const [name, icon, shoppingCartUsages] = product;

			// Generate a unique ID for the record
			const id = Math.random().toString(36).substr(2, 15);
			const now = new Date().toISOString();

			// Insert only if doesn't exist (ignore duplicates)
			db.newQuery(
				`
				INSERT OR IGNORE INTO products (id, created, updated, name, icon, shoppingCartUsages)
				VALUES ({:id}, {:created}, {:updated}, {:name}, {:icon}, {:shoppingCartUsages})
			`
			)
				.bind({
					id: id,
					created: now,
					updated: now,
					name: name,
					icon: icon,
					shoppingCartUsages: shoppingCartUsages
				})
				.execute();
		});
	},
	(db) => {
		// Rollback: Delete all default products
		const defaultProductNames = [
			'Apples',
			'Bananas',
			'Oranges',
			'Lemons',
			'Strawberries',
			'Blueberries',
			'Tomatoes',
			'Onions',
			'Garlic',
			'Carrots',
			'Potatoes',
			'Bell Peppers',
			'Mushrooms',
			'Spinach',
			'Lettuce',
			'Chicken Breast',
			'Ground Beef',
			'Salmon',
			'Eggs',
			'Tofu',
			'Milk',
			'Cheese',
			'Butter',
			'Greek Yogurt',
			'Rice',
			'Pasta',
			'Bread',
			'Oats',
			'Quinoa',
			'Olive Oil',
			'Salt',
			'Black Pepper',
			'Sugar',
			'Flour',
			'Baking Powder',
			'Vanilla Extract',
			'Basil',
			'Oregano',
			'Thyme',
			'Rosemary',
			'Paprika',
			'Cumin',
			'Canned Tomatoes',
			'Coconut Milk',
			'Chicken Broth',
			'Black Beans',
			'Chickpeas',
			'Soy Sauce',
			'Hot Sauce',
			'Mayonnaise',
			'Ketchup',
			'Mustard',
			'Coffee',
			'Tea',
			'Orange Juice',
			'Almonds',
			'Peanut Butter',
			'Dark Chocolate'
		];

		defaultProductNames.forEach((name) => {
			db.newQuery(`DELETE FROM products WHERE name = {:name}`).bind({ name: name }).execute();
		});
	}
);
