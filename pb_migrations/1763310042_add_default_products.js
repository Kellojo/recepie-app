/// <reference path="../pb_data/types.d.ts" />

const defaultProducts = [
	// Fruits
	['Apfel', 'noto:red-apple', 0],
	['Apfel (grün)', 'noto:green-apple', 0],
	['Birne', 'noto:pear', 0],
	['Banane', 'noto:banana', 0],
	['Orange', 'noto:orange-circle', 0],
	['Zitrone', 'noto:lemon', 0],
	['Erdbeere', 'noto:strawberry', 0],
	['Blaubeere', 'noto:blueberries', 0],
	['Mango', 'noto:mango', 0],
	['Trauben', 'noto:grapes', 0],
	['Ananas', 'noto:pineapple', 0],
	['Wassermelone', 'noto:watermelon', 0],
	['Melone', 'noto:melon', 0],
	['Kirsche', 'noto:cherries', 0],
	['Pfirsich', 'noto:peach', 0],
	['Kiwi', 'noto:kiwi-fruit', 0],

	// Vegetables
	['Tomate', 'noto:tomato', 0],
	['Zwiebel', 'noto:onion', 0],
	['Knoblauch', 'noto:garlic', 0],
	['Karotte', 'noto:carrot', 0],
	['Kartoffel', 'noto:potato', 0],
	['Paprika', 'noto:bell-pepper', 0],
	['Paprika (rot)', 'noto:bell-pepper', 0],
	['Paprika (grün)', 'noto:bell-pepper', 0],
	['Paprika (gelb)', 'noto:bell-pepper', 0],
	['Champignons', 'noto:brown-mushroom', 0],
	['Spinat', 'twemoji:leafy-green', 0],
	['Salat', 'twemoji:leafy-green', 0],
	['Avocado', 'noto:avocado', 0],
	['Gurke', 'noto:cucumber', 0],
	['Brokkoli', 'noto:broccoli', 0],
	['Oliven', 'noto:olive', 0],
	['Zucchini', 'noto:cucumber', 0],
	['Süßkartoffel', 'noto:sweet-potato', 0],
	['Mais', 'noto:ear-of-corn', 0],
	['Ingwer', 'noto:ginger-root', 0],

	// Meat & Protein
	['Hähnchenbrust', 'noto:chicken', 0],
	['Rinderhackfleisch', 'noto:cut-of-meat', 0],
	['Lachs', 'noto:fish', 0],
	['Eier', 'noto:egg', 0],
	['Tofu', 'hugeicons:ice-cubes', 0],

	// Dairy
	['Milch', 'streamline-cyber-color:milk-carton-1', 0],
	['Käse', 'noto:cheese-wedge', 0],
	['Butter', 'noto:butter', 0],
	['Griechischer Joghurt', '', 0],

	// Grains & Bread
	['Reis', 'noto:cooked-rice', 0],
	['Pasta', 'noto:pasta', 0],
	['Brot', 'noto:baguette-bread', 0],
	['Croissant', 'noto:croissant', 0],
	['Baguette', 'noto:baguette-bread', 0],
	['Brötchen', 'noto:bread', 0],
	['Bretzel', 'noto:pretzel', 0],
	['Pita Brot', 'noto:flatbread', 0],
	['Wraps', 'noto:flatbread', 0],
	['Haferflocken', 'noto:grain', 0],
	['Quinoa', 'noto:grain', 0],

	// Pantry Staples
	['Olivenöl', 'noto:olive', 0],
	['Salz', 'noto:salt', 0],
	['Schwarzer Pfeffer', 'noto:salt', 0],
	['Zucker', 'hugeicons:ice-cubes', 0],
	['Mehl', 'noto:sack', 0],
	['Backpulver', 'noto:powder', 0],
	['Vanilleextrakt', 'noto:bottle-tonic-outline', 0],

	// Herbs & Spices
	['Basilikum', 'noto-v1:herb', 0],
	['Oregano', 'noto-v1:herb', 0],
	['Thymian', 'noto-v1:herb', 0],
	['Rosmarin', 'noto-v1:herb', 0],
	['Paprikapulver', 'noto-v1:herb', 0],
	['Kreuzkümmel', 'noto-v1:herb', 0],

	// Canned/Packaged
	['Tomaten', 'noto:canned-food', 0],
	['Kokosmilch', 'noto:coconut', 0],
	['Hühnerbrühe', 'noto:bottle-tonic', 0],
	['Schwarze Bohnen', 'noto:beans', 0],
	['Kidneybohnen', 'noto:beans', 0],
	['Kichererbsen', 'noto:can', 0],

	// Condiments & Sauces
	['Soja Sauce', 'game-icons:beer-bottle', 0],
	['Hot Sauce', 'noto:hot-pepper', 0],
	['Mayonnaise', 'game-icons:ketchup', 0],
	['Ketchup', 'game-icons:ketchup', 0],
	['Senf', 'game-icons:ketchup', 0],

	// Beverages
	['Kaffee', 'noto:hot-beverage', 0],
	['Tee', 'noto:teacup-without-handle', 0],
	['Orangensaft', 'noto:orange-circle', 0],

	// Breakfast Items
	['Erdnussbutter', 'noto:peanuts', 0],
	['Marmelade', 'noto:jar', 0],
	['Honig', 'noto:honey-pot', 0],

	// Snacks
	['Erdnüsse', 'noto:peanuts', 0],
	['Schokolade', 'noto:chocolate-bar', 0],
	['Popkorn', 'noto:popcorn', 0],
	['Kekse', 'noto:cookie', 0],

	// Other
	['Eis', 'noto:ice', 0]
];

migrate(
	(db) => {
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
		defaultProducts.forEach((product) => {
			const [name] = product;
			db.newQuery(`DELETE FROM products WHERE name = {:name}`).bind({ name: name }).execute();
		});
	}
);
