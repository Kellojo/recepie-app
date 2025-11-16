<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	let { children } = $props();
</script>

<div class="header">
	<nav>
		<a class="nav-item" class:active={$page.url.pathname === '/shopping-list'} href="/shopping-list"
			>Shopping List</a
		>
		<a class="nav-item" class:active={$page.url.pathname === '/recipes'} href="/recipes">Recepies</a
		>
		<a class="nav-item" class:active={$page.url.pathname === '/products'} href="/products"
			>Products</a
		>

		<a class="nav-item adminPanel" href={dev ? 'http://localhost:8080/_' : '/_'}>Admin Panel</a>
	</nav>
</div>

<div class="page">
	<div>
		{@render children?.()}
	</div>
</div>

<style>
	.page {
		padding: 2rem;
	}

	.page,
	nav {
		width: 100%;
		max-width: 1088px;
		box-sizing: border-box;
		margin: 0 auto;
		padding-left: 2rem;
		padding-right: 2rem;
	}

	.header {
		width: 100%;
		padding: 1rem 0;
		border-bottom: 1px solid var(--borderColor);
		position: sticky;
		top: 0;
		backdrop-filter: blur(1rem);
		overflow: auto;
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
		white-space: nowrap;
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

	.adminPanel {
		margin-left: auto;
		color: var(--secondaryText);
	}
</style>
