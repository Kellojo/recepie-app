<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		maxWidth = '300px',
		onsearch = () => {},
		suggestions = null
	} = $props();

	function onClear() {
		value = '';
		onsearch();
	}
</script>

<div class="search-container" style="max-width: {maxWidth}">
	<Icon icon="mdi:magnify" class="search-icon" />
	<input type="text" {placeholder} bind:value class="search-input" oninput={() => onsearch()} />
	{#if value.trim()}
		<button
			class="clear-search"
			onclick={() => {
				onClear();
			}}
			aria-label="Clear search"
		>
			<Icon icon="mdi:close" />
		</button>
	{/if}

	{#if suggestions && value.trim()}
		<div class="suggestions">
			{@render suggestions?.()}
		</div>
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
		border-radius: 0.5rem;
		background: var(--background);
		color: var(--primaryText);
		font-size: 1rem;
		transition: all 0.2s ease;
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

	.suggestions {
		position: absolute;
		bottom: 0%;
		transform: translateY(calc(100% + 0.5rem));

		background-color: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-s);
		width: 100%;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.search-container {
			min-width: 100%;
		}
	}
</style>
