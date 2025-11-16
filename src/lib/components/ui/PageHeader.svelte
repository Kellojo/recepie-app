<script lang="ts">
	import SearchField from './SearchField.svelte';
	import Icon from '@iconify/svelte';

	let {
		title,
		subtitle = '',
		buttonText = '',
		buttonIcon = 'mdi:plus',
		onButtonClick,
		buttonDisabled = false,
		searchValue = $bindable(''),
		searchPlaceholder = 'Search...',
		showSearch = false
	} = $props();
</script>

<div class="page-header-container">
	<div class="page-header">
		<div>
			<h1>{title}</h1>
			<span class="subtitle">{subtitle}</span>
		</div>

		{#if showSearch}
			<SearchField bind:value={searchValue} placeholder={searchPlaceholder} />
		{/if}

		{#if buttonText}
			<button class="action-button" onclick={onButtonClick} disabled={buttonDisabled}>
				<Icon icon={buttonIcon} width="20" height="20" />
				{buttonText}
			</button>
		{/if}
	</div>
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}

	.page-header h1 {
		margin: 0;
		color: var(--primaryText);
		font-size: 1.75rem;
		font-weight: 600;
	}

	.subtitle {
		color: var(--secondaryText);
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--info);
		border: none;
		color: var(--primaryText);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-s);
	}

	.action-button:hover:not(:disabled) {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
		transform: translateY(-1px);
	}

	.action-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--shadow-s);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.page-header h1 {
			font-size: 1.5rem;
		}

		.action-button {
			align-self: stretch;
			justify-content: center;
		}
	}
</style>
