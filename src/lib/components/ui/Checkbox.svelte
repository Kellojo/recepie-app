<script lang="ts">
	import Icon from '@iconify/svelte';

	let { checked = false, onChange = (checked: boolean) => {} } = $props();

	function onPress() {
		checked = !checked;
		onChange(checked);
	}
</script>

<button
	class="checkbox"
	aria-pressed={checked}
	onclick={onPress}
	onkeydown={(e) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			onPress();
		}
	}}
>
	{#if checked}
		<Icon icon="mdi:check" width="24px" height="24px" />
	{/if}
</button>

<style>
	.checkbox {
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--borderColor);
		border-radius: 0.5rem;
		background-color: var(--backgroundLight);
		box-shadow: var(--shadow-s);
		color: var(--primaryText);

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
