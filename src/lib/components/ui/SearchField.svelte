<script lang="ts">
	import Icon from '@iconify/svelte';

	let { value = $bindable(''), placeholder = 'Search...', maxWidth = '300px' } = $props();
</script>

<div class="search-container" style="max-width: {maxWidth}">
	<Icon icon="mdi:magnify" class="search-icon" />
	<input type="text" {placeholder} bind:value class="search-input" />
	{#if value.trim()}
		<button class="clear-search" onclick={() => (value = '')} aria-label="Clear search">
			<Icon icon="mdi:close" />
		</button>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		border: 2px solid var(--borderColor);
		border-radius: 1rem;
		background: var(--background);
		color: var(--primaryText);
		font-size: 1rem;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-s);
	}

	.search-input::placeholder {
		color: var(--secondaryText);
		opacity: 0.8;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--info);
		box-shadow: var(--shadow-m);
	}

	:global(.search-icon) {
		position: absolute;
		left: 0.75rem;
		color: var(--secondaryText);
		pointer-events: none;
	}

	.clear-search {
		position: absolute;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		border: none;
		background: transparent;
		color: var(--secondaryText);
		cursor: pointer;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.clear-search:hover {
		background: var(--backgroundLight);
		color: var(--primaryText);
	}
</style>
