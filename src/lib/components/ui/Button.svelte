<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		variant?: 'default' | 'emphasized' | 'delete';
		type?: 'button' | 'submit';
		disabled?: boolean;
		loading?: boolean;
		icon?: string;
		onclick?: () => void;
		children?: any;
	}

	let {
		variant = 'default',
		type = 'button',
		disabled = false,
		loading = false,
		icon,
		onclick,
		children
	}: Props = $props();

	function handleClick() {
		if (!disabled && !loading && onclick) {
			onclick();
		}
	}
</script>

<button {type} class="btn btn-{variant}" class:loading {disabled} onclick={handleClick}>
	{#if loading}
		<div class="spinner"></div>
	{:else if icon}
		<Icon {icon} width="16" height="16" />
	{/if}
	{@render children?.()}
</button>

<style>
	.btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
		border: none;
		font-family: inherit;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		min-width: 0;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-default {
		background: transparent;
		border: 1px solid var(--borderColor);
		color: var(--secondaryText);
	}

	.btn-default:hover:not(:disabled) {
		background: var(--backgroundLight);
		color: var(--primaryText);
	}

	.btn-emphasized {
		background: var(--info);
		color: var(--primaryText);
		font-weight: 500;
		box-shadow: var(--shadow-s);
	}

	.btn-emphasized:hover:not(:disabled) {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
		transform: translateY(-1px);
	}

	.btn-emphasized:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--shadow-s);
	}

	.btn-delete {
		background: transparent;
		border: 1px solid var(--error);
		color: var(--error);
		font-weight: 500;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}

	.btn-delete:hover:not(:disabled) {
		background: var(--errorSecondary);
		color: var(--error);
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
</style>
