<script lang="ts">
	import { Button, Input, IconPicker, Dialog } from '$lib/components/ui';

	// Demo state
	let dialogOpen = $state(false);
	let inputValue = $state('');
	let iconValue = $state('mdi:heart');
	let showIconPicker = $state(false);
	let loading = $state(false);

	function handleSubmit() {
		loading = true;
		// Simulate async operation
		setTimeout(() => {
			loading = false;
			alert(`Submitted: ${inputValue} with icon: ${iconValue}`);
		}, 2000);
	}

	function openDialog() {
		dialogOpen = true;
	}

	function closeDialog() {
		dialogOpen = false;
	}

	function simulateLoading() {
		loading = true;
		setTimeout(() => {
			loading = false;
		}, 2000);
	}
</script>

<div class="demo-page">
	<h1>Reusable UI Components Demo</h1>

	<section class="demo-section">
		<h2>Buttons</h2>
		<div class="button-grid">
			<Button variant="default">Default Button</Button>
			<Button variant="emphasized" icon="mdi:plus">Emphasized Button</Button>
			<Button variant="delete" icon="mdi:delete">Delete Button</Button>
			<Button variant="emphasized" {loading} onclick={simulateLoading}>
				{loading ? 'Loading...' : 'Click to Load'}
			</Button>
			<Button variant="default" disabled>Disabled Button</Button>
		</div>
	</section>

	<section class="demo-section">
		<h2>Input Field</h2>
		<div class="input-demo">
			<Input
				label="Example Input"
				bind:value={inputValue}
				placeholder="Type something..."
				helpText="This is a help text"
				required
			/>
		</div>
	</section>

	<section class="demo-section">
		<h2>Icon Picker</h2>
		<div class="icon-demo">
			<IconPicker
				label="Choose an Icon"
				bind:value={iconValue}
				bind:showPicker={showIconPicker}
				placeholder="Select or type an icon name"
				helpText="You can use any icon from"
				helpLink={{ url: 'https://icon-sets.iconify.design/', text: 'Iconify' }}
			/>
		</div>
	</section>

	<section class="demo-section">
		<h2>Dialog</h2>
		<Button variant="emphasized" onclick={openDialog}>Open Dialog</Button>
	</section>

	<Dialog bind:isOpen={dialogOpen} title="Example Dialog" onClose={closeDialog}>
		{#snippet children()}
			<div class="dialog-demo-content">
				<p>This is a reusable dialog component with:</p>
				<ul>
					<li>Smooth animations</li>
					<li>Escape key support</li>
					<li>Backdrop click to close</li>
					<li>Responsive design</li>
					<li>Unified actions slot</li>
				</ul>

				<Input label="Sample Field" value="Demo value" placeholder="Enter something..." />
			</div>
		{/snippet}

		{#snippet actions()}
			<div class="main-actions">
				<Button variant="default" onclick={closeDialog}>Cancel</Button>
				<Button variant="emphasized" icon="mdi:check" onclick={handleSubmit} {loading}>Save</Button>
			</div>
		{/snippet}
	</Dialog>
</div>

<style>
	.demo-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.demo-page h1 {
		color: var(--primaryText);
		margin-bottom: 2rem;
	}

	.demo-section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		border: 1px solid var(--borderColor);
		border-radius: 8px;
		background: var(--backgroundLight);
	}

	.demo-section h2 {
		color: var(--primaryText);
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.button-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		align-items: center;
	}

	.input-demo,
	.icon-demo {
		max-width: 400px;
	}

	.dialog-demo-content p {
		color: var(--primaryText);
		margin-bottom: 1rem;
	}

	.dialog-demo-content ul {
		color: var(--secondaryText);
		margin-bottom: 1.5rem;
	}

	.dialog-demo-content li {
		margin-bottom: 0.5rem;
	}

	@media (max-width: 768px) {
		.demo-page {
			padding: 1rem;
		}

		.button-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
