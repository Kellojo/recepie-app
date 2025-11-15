<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		isOpen: boolean;
		title: string;
		onClose?: () => void;
		showCloseButton?: boolean;
		children?: any;
		actions?: any;
	}

	let {
		isOpen = $bindable(),
		title,
		onClose,
		showCloseButton = true,
		children,
		actions
	}: Props = $props();

	function handleClose() {
		isOpen = false;
		if (onClose) {
			onClose();
		}
	}

	function handleOverlayClick() {
		handleClose();
	}

	function handleDialogClick(e: Event) {
		e.stopPropagation();
	}

	// Add global keydown listener when dialog is open
	$effect(() => {
		if (isOpen) {
			const handleGlobalKeydown = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					handleClose();
				}
			};

			document.addEventListener('keydown', handleGlobalKeydown);

			return () => {
				document.removeEventListener('keydown', handleGlobalKeydown);
			};
		}
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dialog-overlay"
		onclick={handleOverlayClick}
		transition:fade={{ duration: 200, easing: cubicOut }}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="dialog"
			onclick={handleDialogClick}
			transition:scale={{ duration: 200, easing: cubicOut, start: 0.95 }}
		>
			<div class="dialog-header">
				<h2>{title}</h2>
				{#if showCloseButton}
					<button class="close-button" onclick={handleClose} title="Close">
						<Icon icon="mdi:close" width="24" height="24" />
					</button>
				{/if}
			</div>

			<div class="dialog-content">
				{@render children?.()}
			</div>

			{#if actions}
				<div class="dialog-actions">
					{@render actions()}
				</div>
			{/if}
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
		width: 100%;
		height: 100%;
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
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--borderColor);
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
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--primaryText);
	}

	.close-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--secondaryText);
		border-radius: 6px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
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

	.dialog-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		padding-bottom: 1.5rem;
		border-top: 1px solid var(--borderColor);
		gap: 1rem;
	}

	.dialog-actions :global(.delete-section) {
		flex: 1;
	}

	.dialog-actions :global(.delete-confirm) {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.dialog-actions :global(.delete-confirm span) {
		color: var(--error);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.dialog-actions :global(.delete-confirm) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.dialog-actions :global(.main-actions) {
		display: flex;
		gap: 0.75rem;
		align-items: center;
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

		.dialog-actions :global(.main-actions) {
			order: -1;
			justify-content: stretch;
		}

		.dialog-actions :global(.main-actions) :global(.btn) {
			flex: 1;
			min-width: 0;
		}

		.dialog-actions :global(.delete-section) {
			text-align: center;
		}

		.dialog-actions :global(.delete-confirm) {
			justify-content: center;
			flex-wrap: wrap;
		}
	}
</style>
