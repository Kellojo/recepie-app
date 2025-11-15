<script lang="ts">
	import Icon from '@iconify/svelte';
	let { name = '', quantity = 0, icon = '', onpress } = $props();
</script>

<div
	class="grid-item"
	role="button"
	tabindex="0"
	onclick={onpress}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onpress?.();
		}
	}}
>
	<Icon width="2.5rem" height="2.5rem" {icon} class="icon" />
	<span class="name">{name}</span>
    {#if quantity > 1}
	<span class="quantity">{quantity}</span>
    {/if}
</div>

<style>
	.grid-item {
		border: 1px solid var(--borderColor);
		border-radius: 1rem;

		background-color: var(--background);
		backdrop-filter: blur(2rem);
		padding: 1rem;
		box-shadow: var(--shadow-s);

		cursor: pointer;

		position: relative;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;

		transition: all 0.15s ease;

		width: 128px;
		height: 128px;
		box-sizing: border-box;
	}

	.grid-item:hover {
		transform: scale(1.02);
		box-shadow: var(--shadow-m);
	}

	.grid-item:focus {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.grid-item:active {
		transform: scale(0.98);
	}

	.name {
		font-weight: bold;
		color: var(--primaryText);
	}

	.quantity {
		color: var(--secondaryText);
		font-size: 0.875rem;
	}
</style>
