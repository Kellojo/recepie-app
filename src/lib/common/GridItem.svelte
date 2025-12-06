<script lang="ts">
	import Icon from '@iconify/svelte';
	let { name = '', quantity = 0, icon = '', onpress } = $props();

	let previousQuantity = $state(quantity);
	let shouldAnimate = $state(false);
	let isIncreasing = $state(true);

	// Watch for quantity changes
	$effect(() => {
		if (quantity !== previousQuantity && previousQuantity > 0) {
			isIncreasing = quantity > previousQuantity;
			shouldAnimate = true;
			// Reset animation after it completes
			setTimeout(() => {
				shouldAnimate = false;
			}, 300);
		}
		previousQuantity = quantity;
	});
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
		<span
			class="quantity"
			class:animate-increase={shouldAnimate && isIncreasing}
			class:animate-decrease={shouldAnimate && !isIncreasing}>{quantity}</span
		>
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
		gap: 0.5rem;

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
		overflow: hidden;
		max-width: 100%;
		word-break: break-word;
		text-align: center;
	}

	.quantity {
		color: var(--secondaryText);
		font-size: 0.875rem;
		transition: all 0.3s ease;
	}

	.quantity.animate-increase {
		animation: quantityBounceUp 0.3s ease;
		color: var(--success);
		font-weight: bold;
	}

	.quantity.animate-decrease {
		animation: quantityBounceDown 0.3s ease;
		color: var(--error);
		font-weight: bold;
	}

	@keyframes quantityBounceUp {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes quantityBounceDown {
		0% {
			transform: scale(1);
		}
		25% {
			transform: scale(0.8);
		}
		75% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
