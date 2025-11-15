<script lang="ts">
	import type ShoppingListItem from '../types/ShoppingListItem';
	import { createEventDispatcher } from 'svelte';
	import Dialog from './ui/Dialog.svelte';
	import Input from './ui/Input.svelte';
	import Button from './ui/Button.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		isOpen: boolean;
		item?: ShoppingListItem | null;
		mode: 'create' | 'edit';
	}

	let { isOpen = $bindable(), item = null, mode }: Props = $props();

	const dispatch = createEventDispatcher<{
		save: { item: Partial<ShoppingListItem> };
		delete: { id: string };
		cancel: void;
	}>();

	// Form state
	let formData = $state({
		name: '',
		icon: '',
		quantity: 1
	});

	// UI state
	let isSubmitting = $state(false);
	let deleteConfirm = $state(false);

	// Validation
	const isValid = $derived(() => {
		return formData.name.trim().length > 0 && formData.quantity > 0;
	});

	// Reset form when dialog opens/closes or item changes
	$effect(() => {
		if (isOpen && item && mode === 'edit') {
			formData = {
				name: item.name || '',
				icon: item.icon || '',
				quantity: item.quantity || 1
			};
		} else if (isOpen && mode === 'create') {
			formData = {
				name: '',
				icon: '',
				quantity: 1
			};
		}
		deleteConfirm = false;
		isSubmitting = false;
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!isValid || isSubmitting) return;

		isSubmitting = true;
		dispatch('save', { item: formData });
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleDelete() {
		if (item && deleteConfirm) {
			dispatch('delete', { id: item.id });
		} else {
			deleteConfirm = true;
			setTimeout(() => {
				deleteConfirm = false;
			}, 3000);
		}
	}

	function increaseQuantity() {
		formData.quantity++;
	}

	function decreaseQuantity() {
		if (formData.quantity > 1) {
			formData.quantity--;
		}
	}
</script>

<Dialog
	bind:isOpen
	title={mode === 'create' ? 'Add Shopping List Item' : 'Edit Shopping List Item'}
>
	{#snippet children()}
		<form onsubmit={handleSubmit} class="item-form">
			<div class="form-group">
				<Input
					label="Product Name"
					bind:value={formData.name}
					placeholder="Enter product name..."
					required
				/>
			</div>

			<div class="form-group">
				<Input
					label="Icon (optional)"
					bind:value={formData.icon}
					placeholder="e.g., mdi:food-apple"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="quantity-controls">Quantity</label>
				<div id="quantity-controls" class="quantity-controls">
					<button
						type="button"
						class="quantity-btn"
						onclick={decreaseQuantity}
						disabled={formData.quantity <= 1}
						aria-label="Decrease quantity"
					>
						<Icon icon="mdi:minus" />
					</button>
					<span class="quantity-display">{formData.quantity}</span>
					<button
						type="button"
						class="quantity-btn"
						onclick={increaseQuantity}
						aria-label="Increase quantity"
					>
						<Icon icon="mdi:plus" />
					</button>
				</div>
			</div>
		</form>
	{/snippet}

	{#snippet actions()}
		{#if mode === 'edit' && item}
			<Button variant="delete" onclick={handleDelete} disabled={isSubmitting}>
				<Icon icon={deleteConfirm ? 'mdi:check' : 'mdi:delete'} />
				{deleteConfirm ? 'Confirm Delete' : 'Delete'}
			</Button>
		{/if}

		<div class="action-spacer"></div>

		<Button variant="default" onclick={handleCancel} disabled={isSubmitting}>Cancel</Button>
		<Button
			variant="emphasized"
			onclick={() => handleSubmit(new Event('click'))}
			disabled={!isValid || isSubmitting}
			loading={isSubmitting}
		>
			<Icon icon="mdi:content-save" />
			{mode === 'create' ? 'Add Item' : 'Save Changes'}
		</Button>
	{/snippet}
</Dialog>

<style>
	.item-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.quantity-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.quantity-btn:hover:not(:disabled) {
		border-color: var(--accent);
		background: var(--accent-bg);
	}

	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity-display {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		min-width: 2rem;
		text-align: center;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		background: var(--surface-raised);
	}

	.action-spacer {
		flex: 1;
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		.quantity-controls {
			justify-content: center;
		}
	}
</style>
