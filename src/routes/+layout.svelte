<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<div class="page">
	<nav>
		<a class="nav-item" class:active={$page.url.pathname === '/shopping-list'} href="/shopping-list"
			>Shopping List</a
		>
		<a class="nav-item" class:active={$page.url.pathname === '/recipes'} href="/recipes">Recepies</a
		>
		<a class="nav-item" class:active={$page.url.pathname === '/products'} href="/products"
			>Products</a
		>
	</nav>

	<div>
		{@render children?.()}
	</div>
</div>

<style>
	.page {
		width: 100%;
		max-width: 848px;
		min-height: 100vh;
		box-sizing: border-box;
		margin: 0 auto;
		padding: 2rem;
	}

	nav {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.nav-item {
		text-decoration: none;
		color: var(--primaryText);
		font-weight: bold;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
	}

	.nav-item:hover {
		background-color: var(--backgroundLight);
	}

	.nav-item.active {
		background-color: var(--backgroundLight);
		color: var(--primaryText);
		box-shadow: var(--shadow-s);
	}

	.nav-item.active:hover {
		filter: brightness(1.1);
	}
</style>
