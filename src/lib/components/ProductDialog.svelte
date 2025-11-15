<script lang="ts">
	import type Product from '../types/Product';
	import { createEventDispatcher } from 'svelte';
	import Dialog from './ui/Dialog.svelte';
	import Input from './ui/Input.svelte';
	import IconPicker from './ui/IconPicker.svelte';
	import Button from './ui/Button.svelte';

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

	// UI state
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
		isSubmitting = false;
	});

	function handleSubmit(event?: Event) {
		event?.preventDefault();
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

	function handleButtonSubmit() {
		handleSubmit();
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

	function handleIconSelect(iconName: string) {
		formData.icon = iconName;
		showIconPicker = false;
	}

	function toggleDeleteConfirm() {
		deleteConfirm = !deleteConfirm;
	}
</script>

<Dialog
	bind:isOpen
	title={mode === 'create' ? 'Add New Product' : 'Edit Product'}
	onClose={handleCancel}
>
	{#snippet children()}
		<form onsubmit={handleSubmit}>
			<Input
				id="product-name"
				label="Product Name"
				bind:value={formData.name}
				placeholder="Enter product name"
				required={true}
				disabled={isSubmitting}
			/>

			<IconPicker
				id="product-icon"
				label="Icon"
				bind:value={formData.icon}
				bind:showPicker={showIconPicker}
				placeholder="Enter icon name or search below"
				disabled={isSubmitting}
				helpText="You can use any icon from"
				helpLink={{ url: 'https://icon-sets.iconify.design/', text: 'Iconify' }}
				onSelectIcon={handleIconSelect}
			/>
		</form>
	{/snippet}

	{#snippet actions()}
		{#if mode === 'edit' && product}
			<div class="delete-section">
				{#if !deleteConfirm}
					<Button
						variant="delete"
						icon="mdi:delete"
						disabled={isSubmitting}
						onclick={toggleDeleteConfirm}
					>
						Delete Product
					</Button>
				{:else}
					<div class="delete-confirm">
						<span>Are you sure?</span>
						<Button
							variant="delete"
							icon="mdi:delete"
							disabled={isSubmitting}
							loading={isSubmitting}
							onclick={handleDelete}
						>
							Yes, Delete
						</Button>
						<Button variant="default" disabled={isSubmitting} onclick={toggleDeleteConfirm}>
							Cancel
						</Button>
					</div>
				{/if}
			</div>
		{/if}

		<div class="main-actions">
			<Button variant="default" disabled={isSubmitting} onclick={handleCancel}>Cancel</Button>
			<Button
				variant="emphasized"
				icon="mdi:content-save"
				disabled={isSubmitting || !formData.name.trim()}
				loading={isSubmitting}
				onclick={handleButtonSubmit}
			>
				{mode === 'create' ? 'Create Product' : 'Save Changes'}
			</Button>
		</div>
	{/snippet}
</Dialog>

<!-- All styles are now handled by the reusable UI components -->
