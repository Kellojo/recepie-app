<script lang="ts">
	import Button from './Button.svelte';
	import SearchField from './SearchField.svelte';

	let {
		title,
		subtitle = '',
		buttonText = '',
		buttonIcon = 'mdi:plus',
		onButtonClick = null,
		buttonDisabled = false,
		searchField
	} = $props();
</script>

<div class="page-header-container">
	<div class="page-header">
		<div>
			<h1>{title}</h1>
			<span class="subtitle">{subtitle}</span>
		</div>

		<div class="search-container">
			{@render searchField?.()}
		</div>

		<div class="action-container">
			{#if buttonText}
				<Button
					icon={buttonIcon}
					variant="emphasized"
					onclick={onButtonClick}
					disabled={buttonDisabled}>{buttonText}</Button
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.page-header {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 2rem;
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

	.search-container {
		display: flex;
		justify-content: center;
		position: relative;
	}

	.action-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.page-header {
			gap: 1rem;
			grid-template-columns: 1fr;
		}
	}
</style>
