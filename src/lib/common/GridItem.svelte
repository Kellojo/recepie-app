<script lang="ts">
	import Icon from '@iconify/svelte';
	let { name = '', quantity = 0, icon = '' } = $props();
</script>

<div class="grid-item">
	<Icon width="2.5rem" height="2.5rem" {icon} class="icon" />
	<span class="name">{name}</span>
	<span class="quantity">{quantity}</span>
</div>

<style>
	.grid-item {
		border: 1px solid var(--borderColor);
		border-radius: 1rem;

		background-color: var(--background);
		backdrop-filter: blur(2rem);
		padding: 1rem;
		box-shadow: var(--shadow-s);

		cursor: default;

		position: relative;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;

		transition: border-color 0.1s ease-out;

		width: 128px;
		height: 128px;
		box-sizing: border-box;
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
