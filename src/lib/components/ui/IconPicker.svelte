<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		id?: string;
		label: string;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		showPicker?: boolean;
		error?: string;
		helpText?: string;
		helpLink?: { url: string; text: string };
		onTogglePicker?: () => void;
		onSelectIcon?: (iconName: string) => void;
	}

	let {
		id,
		label,
		value = $bindable(''),
		placeholder,
		disabled = false,
		showPicker = $bindable(false),
		error,
		helpText,
		helpLink,
		onTogglePicker,
		onSelectIcon
	}: Props = $props();

	const iconCategories = {
		'Food & Produce': [
			'mdi:food-apple',
			'mdi:food-variant',
			'mdi:carrot',
			'mdi:leaf',
			'noto:avocado',
			'noto:tomato',
			'noto:lemon',
			'noto:strawberry',
			'noto:cherries'
		],
		'Grains & Bakery': [
			'mdi:bread-slice',
			'noto:bread',
			'mdi:rice',
			'mdi:pasta',
			'noto:croissant',
			'noto:pretzel',
			'noto:bagel',
			'mdi:grain'
		],
		'Dairy & Protein': [
			'mdi:egg',
			'noto:cheese-wedge',
			'mdi:fish',
			'mdi:cow',
			'noto:milk-glass',
			'mdi:bottle-wine',
			'mdi:food-steak'
		],
		'Pantry & Spices': [
			'mdi:bottle-wine-outline',
			'mdi:shaker-outline',
			'mdi:cup',
			'mdi:coffee',
			'mdi:tea-hot',
			'mdi:honey',
			'mdi:oil'
		],
		Generic: [
			'mdi:package-variant',
			'mdi:basket',
			'mdi:shopping-basket',
			'mdi:food',
			'mdi:silverware-fork-knife'
		]
	};

	function selectIcon(iconName: string) {
		value = iconName;
		showPicker = false;
		if (onSelectIcon) {
			onSelectIcon(iconName);
		}
	}

	function togglePicker() {
		showPicker = !showPicker;
		if (onTogglePicker) {
			onTogglePicker();
		}
	}
</script>

<div class="form-group">
	<label for={id}>
		{label}
	</label>
	<div class="icon-input-group">
		<input {id} type="text" bind:value {placeholder} {disabled} class:error />
		{#if value}
			<div class="icon-preview">
				<Icon icon={value} width="24" height="24" />
			</div>
		{/if}
		<button
			type="button"
			class="icon-picker-toggle"
			onclick={togglePicker}
			{disabled}
			title={showPicker ? 'Hide icon picker' : 'Show icon picker'}
		>
			<Icon icon={showPicker ? 'mdi:chevron-up' : 'mdi:chevron-down'} width="20" height="20" />
		</button>
	</div>

	{#if showPicker}
		<div class="icon-picker">
			<div class="icon-categories">
				{#each Object.entries(iconCategories) as [category, icons]}
					<div class="icon-category">
						<h4 class="category-title">{category}</h4>
						<div class="icon-grid">
							{#each icons as iconName}
								<button
									type="button"
									class="icon-suggestion"
									class:selected={value === iconName}
									onclick={() => selectIcon(iconName)}
									title={iconName}
									{disabled}
								>
									<Icon icon={iconName} width="20" height="20" />
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if helpText}
		<div class="icon-help">
			<p>
				<Icon icon="mdi:information" width="16" height="16" />
				{helpText}
				{#if helpLink}
					<a href={helpLink.url} target="_blank" rel="noopener noreferrer">
						{helpLink.text}
					</a>
				{/if}
			</p>
		</div>
	{/if}

	{#if error}
		<div class="error-message">{error}</div>
	{/if}
</div>

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	label {
		font-weight: 600;
		color: var(--primaryText);
		font-size: 0.9rem;
	}

	.icon-input-group {
		position: relative;
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		background: var(--background);
		color: var(--primaryText);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	input:focus {
		outline: none;
		border-color: var(--info);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--backgroundDark);
	}

	input.error {
		border-color: var(--error);
	}

	input.error:focus {
		border-color: var(--error);
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.icon-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		color: var(--info);
	}

	.icon-picker-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--background);
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--secondaryText);
	}

	.icon-picker-toggle:hover:not(:disabled) {
		background: var(--backgroundLight);
		border-color: var(--info);
		color: var(--info);
	}

	.icon-picker-toggle:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.icon-picker {
		margin-top: 0.5rem;
		border: 1px solid var(--borderColor);
		border-radius: 8px;
		background: var(--backgroundLight);
		max-height: 300px;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}

	.icon-categories {
		padding: 1rem;
	}

	.icon-category {
		margin-bottom: 1.5rem;
	}

	.icon-category:last-child {
		margin-bottom: 0;
	}

	.category-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--primaryText);
		margin: 0 0 0.75rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--borderColor);
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
		gap: 0.5rem;
	}

	.icon-suggestion {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--borderColor);
		border-radius: 6px;
		background: var(--background);
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--primaryText);
	}

	.icon-suggestion:hover:not(:disabled) {
		background: var(--info);
		color: white;
		border-color: var(--info);
		transform: scale(1.05);
	}

	.icon-suggestion.selected {
		background: var(--info);
		color: white;
		border-color: var(--info);
	}

	.icon-suggestion:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.icon-help {
		margin-top: 0.5rem;
	}

	.icon-help p {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-size: 0.8rem;
		color: var(--secondaryText);
	}

	.icon-help a {
		color: var(--info);
		text-decoration: none;
	}

	.icon-help a:hover {
		text-decoration: underline;
	}

	.error-message {
		color: var(--error);
		font-size: 0.8rem;
		margin-top: -0.25rem;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.icon-grid {
			grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
		}

		.icon-suggestion {
			width: 35px;
			height: 35px;
		}
	}
</style>
