<script lang="ts">
	let { entity, onItemPressed, children, gridTemplateColumns = 'repeat(4, 1fr)' } = $props();

	function onKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			onItemPressed(entity);
		}
	}
</script>

<div
	class="item"
	role="button"
	tabindex="0"
	onclick={onItemPressed.bind(null, entity)}
	onkeypress={onKeyPress}
	style:grid-template-columns={gridTemplateColumns}
>
	{@render children()}
</div>

<style>
	.item {
		display: grid;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;

		padding: 1rem;
		border-bottom: 1px solid var(--borderColor);
		background-color: var(--background);

		cursor: pointer;
		transition: background-color 0.1s;
	}
	.item:hover {
		background-color: var(--backgroundLight);
	}
</style>
