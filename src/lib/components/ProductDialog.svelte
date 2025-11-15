<script lang="ts">
	import Icon from '@iconify/svelte';
	import type Product from '../types/Product';
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		isOpen: boolean;
		product?: Product | null;
		mode: 'create' | 'edit';
	}

	let { isOpen = $bindable(), product = null, mode }: Props = $props();

	const dispatch = createEventDispatcher<{
		save: { product: Partial<Product> };
		delete: { id: string };
		cancel: void;
	}>();

	// Form state
	let formData = $state({
		name: '',
		icon: ''
	});

	// Icon picker state
	let showIconPicker = $state(false);

	let isSubmitting = $state(false);
	let deleteConfirm = $state(false);

	// Reset form when dialog opens/closes or product changes
	$effect(() => {
		if (isOpen && product && mode === 'edit') {
			formData = {
				name: product.name || '',
				icon: product.icon || ''
			};
		} else if (isOpen && mode === 'create') {
			formData = {
				name: '',
				icon: ''
			};
		}
		deleteConfirm = false;
		showIconPicker = false;
		isSubmitting = false; // Reset loading state when dialog opens/closes
	});

	// Categorized icon suggestions
	const iconCategories = {
		'Fruits & Vegetables': [
			'mdi:apple',
			'mdi:food-apple',
			'icon-park-twotone:banana',
			'icon-park-twotone:orange-one',
			'mdi:carrot',
			'ph:carrot-duotone',
			'mdi:fruit-grapes',
			'mdi:leaf',
			'noto:avocado',
			'noto:tomato',
			'noto:lemon',
			'noto:strawberry',
			'noto:cherries'
		],
		'Grains & Bakery': [
			'mdi:bread-slice',
			'noto:bread',
			'mdi:rice',
			'mdi:pasta',
			'noto:croissant',
			'noto:pretzel',
			'noto:bagel',
			'mdi:grain'
		],
		'Dairy & Protein': [
			'mdi:egg',
			'noto:cheese-wedge',
			'mdi:fish',
			'noto:meat-on-bone',
			'noto:bacon',
			'mdi:cow',
			'noto:milk-glass',
			'mdi:food-steak'
		],
		Beverages: [
			'mdi:cup',
			'mdi:bottle-wine',
			'mdi:glass-wine',
			'mdi:coffee',
			'mdi:tea',
			'mdi:bottle-soda',
			'noto:beer-mug',
			'mdi:water'
		],
		'Prepared Foods': [
			'mdi:pizza',
			'noto:hamburger',
			'noto:taco',
			'noto:spaghetti',
			'noto:curry-rice',
			'noto:bento-box',
			'mdi:food-hot-dog',
			'noto:sandwich'
		],
		General: [
			'mdi:package-variant',
			'mdi:shopping-basket',
			'mdi:store',
			'mdi:food',
			'mdi:silverware-fork-knife',
			'mdi:chef-hat'
		]
	};

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!formData.name.trim()) return;

		isSubmitting = true;

		const productData: Partial<Product> = {
			name: formData.name.trim(),
			icon: formData.icon.trim() || 'mdi:package-variant'
		};

		if (mode === 'edit' && product) {
			productData.id = product.id;
		}

		dispatch('save', { product: productData });
	}

	function handleDelete() {
		if (!product?.id || !deleteConfirm) return;

		isSubmitting = true;
		dispatch('delete', { id: product.id });
	}

	function handleCancel() {
		isOpen = false;
		dispatch('cancel');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		}
	}

	// Add global keydown listener when dialog is open
	$effect(() => {
		if (isOpen) {
			const handleGlobalKeydown = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					handleCancel();
				}
			};

			document.addEventListener('keydown', handleGlobalKeydown);

			return () => {
				document.removeEventListener('keydown', handleGlobalKeydown);
			};
		}
	});

	function selectIcon(iconName: string) {
		formData.icon = iconName;
		showIconPicker = false;
	}

	function toggleIconPicker() {
		showIconPicker = !showIconPicker;
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dialog-overlay"
		onclick={handleCancel}
		transition:fade={{ duration: 200, easing: cubicOut }}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="dialog"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, easing: cubicOut, start: 0.95 }}
		>
			<div class="dialog-header">
				<h2>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
				<button class="close-button" onclick={handleCancel} title="Close">
					<Icon icon="mdi:close" width="24" height="24" />
				</button>
			</div>

			<form class="dialog-content" onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="product-name">Product Name *</label>
					<input
						id="product-name"
						type="text"
						bind:value={formData.name}
						placeholder="Enter product name"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="product-icon">Icon</label>
					<div class="icon-input-group">
						<input
							id="product-icon"
							type="text"
							bind:value={formData.icon}
							placeholder="Enter icon name or search below"
							disabled={isSubmitting}
						/>
						{#if formData.icon}
							<div class="icon-preview">
								<Icon icon={formData.icon} width="24" height="24" />
							</div>
						{/if}
						<button
							type="button"
							class="icon-picker-toggle"
							onclick={toggleIconPicker}
							disabled={isSubmitting}
							title={showIconPicker ? 'Hide icon picker' : 'Show icon picker'}
						>
							<Icon
								icon={showIconPicker ? 'mdi:chevron-up' : 'mdi:chevron-down'}
								width="20"
								height="20"
							/>
						</button>
					</div>

					{#if showIconPicker}
						<div class="icon-picker">
							<div class="icon-categories">
								{#each Object.entries(iconCategories) as [category, icons]}
									<div class="icon-category">
										<h4 class="category-title">{category}</h4>
										<div class="icon-grid">
											{#each icons as iconName}
												<button
													type="button"
													class="icon-suggestion"
													class:selected={formData.icon === iconName}
													onclick={() => selectIcon(iconName)}
													title={iconName}
													disabled={isSubmitting}
												>
													<Icon icon={iconName} width="20" height="20" />
												</button>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
					<div class="icon-help">
						<p>
							<Icon icon="mdi:information" width="16" height="16" />
							You can use any icon from
							<a href="https://icon-sets.iconify.design/" target="_blank" rel="noopener noreferrer">
								Iconify
							</a>
						</p>
					</div>
				</div>

				<div class="dialog-actions">
					{#if mode === 'edit' && product}
						<div class="delete-section">
							{#if !deleteConfirm}
								<button
									type="button"
									class="delete-button"
									onclick={() => (deleteConfirm = true)}
									disabled={isSubmitting}
								>
									<Icon icon="mdi:delete" width="16" height="16" />
									Delete Product
								</button>
							{:else}
								<div class="delete-confirm">
									<span>Are you sure?</span>
									<button
										type="button"
										class="delete-confirm-button"
										onclick={handleDelete}
										disabled={isSubmitting}
									>
										<Icon icon="mdi:delete" width="16" height="16" />
										Yes, Delete
									</button>
									<button
										type="button"
										class="cancel-delete-button"
										onclick={() => (deleteConfirm = false)}
										disabled={isSubmitting}
									>
										Cancel
									</button>
								</div>
							{/if}
						</div>
					{/if}

					<div class="main-actions">
						<button
							type="button"
							class="cancel-button"
							onclick={handleCancel}
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="save-button"
							disabled={isSubmitting || !formData.name.trim()}
						>
							{#if isSubmitting}
								<div class="spinner"></div>
							{:else}
								<Icon icon="mdi:content-save" width="16" height="16" />
							{/if}
							{mode === 'create' ? 'Create Product' : 'Save Changes'}
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.dialog {
		background: var(--backgroundLight);
		border-radius: 12px;
		box-shadow: var(--shadow-l);
		border: 1px solid var(--borderColor);
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.dialog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--borderColor);
		background: var(--background);
	}

	.dialog-header h2 {
		margin: 0;
		color: var(--primaryText);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.close-button {
		background: transparent;
		border: none;
		color: var(--secondaryText);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: var(--backgroundLight);
		color: var(--primaryText);
	}

	.dialog-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		color: var(--primaryText);
		font-weight: 500;
		font-size: 0.9rem;
	}

	.form-group input {
		padding: 0.75rem;
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		background: var(--background);
		color: var(--primaryText);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--info);
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.icon-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.icon-input-group input {
		flex: 1;
	}

	.icon-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		color: var(--info);
	}

	.icon-picker-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--secondaryText);
	}

	.icon-picker-toggle:hover:not(:disabled) {
		background: var(--backgroundLight);
		border-color: var(--info);
		color: var(--info);
	}

	.icon-picker {
		margin-top: 0.75rem;
		border: 1px solid var(--borderColor);
		border-radius: 8px;
		background: var(--background);
		max-height: 400px;
		overflow-y: auto;
	}

	.icon-categories {
		padding: 0.75rem;
	}

	.icon-category {
		margin-bottom: 1.5rem;
	}

	.icon-category:last-child {
		margin-bottom: 0;
	}

	.category-title {
		margin: 0 0 0.75rem 0;
		color: var(--primaryText);
		font-size: 0.9rem;
		font-weight: 600;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--borderColor);
	}

	.icon-help {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: var(--backgroundLight);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
	}

	.icon-help p {
		margin: 0;
		color: var(--secondaryText);
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-help a {
		color: var(--info);
		text-decoration: none;
	}

	.icon-help a:hover {
		text-decoration: underline;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
		gap: 0.5rem;
		max-height: 120px;
		overflow-y: auto;
		padding: 0.5rem;
		background: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
	}

	.icon-suggestion {
		width: 40px;
		height: 40px;
		background: transparent;
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--secondaryText);
	}

	.icon-suggestion:hover {
		background: var(--backgroundLight);
		border-color: var(--info);
		color: var(--info);
	}

	.icon-suggestion.selected {
		background: var(--info);
		border-color: var(--info);
		color: var(--primaryText);
	}

	.dialog-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--borderColor);
		gap: 1rem;
	}

	.delete-section {
		flex: 1;
	}

	.delete-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: 1px solid var(--error);
		color: var(--error);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.delete-button:hover:not(:disabled) {
		background: var(--errorSecondary);
	}

	.delete-confirm {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.delete-confirm span {
		color: var(--error);
		font-weight: 500;
	}

	.delete-confirm-button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: var(--error);
		border: none;
		color: white;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.delete-confirm-button:hover:not(:disabled) {
		background: var(--error);
		filter: brightness(1.1);
	}

	.cancel-delete-button {
		background: transparent;
		border: 1px solid var(--borderColor);
		color: var(--secondaryText);
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.cancel-delete-button:hover:not(:disabled) {
		background: var(--backgroundLight);
		color: var(--primaryText);
	}

	.main-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.cancel-button {
		background: transparent;
		border: 1px solid var(--borderColor);
		color: var(--secondaryText);
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.cancel-button:hover:not(:disabled) {
		background: var(--backgroundLight);
		color: var(--primaryText);
	}

	.save-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--info);
		border: none;
		color: var(--primaryText);
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-s);
	}

	.save-button:hover:not(:disabled) {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
		transform: translateY(-1px);
	}

	.save-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--shadow-s);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.dialog {
			width: 95%;
			margin: 1rem;
		}

		.dialog-content {
			padding: 1rem;
		}

		.dialog-header {
			padding: 1rem;
		}

		.dialog-actions {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.main-actions {
			order: -1;
		}

		.delete-section {
			text-align: center;
		}

		.icon-grid {
			grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
		}

		.icon-suggestion {
			width: 35px;
			height: 35px;
		}
	}
</style>
