<script lang="ts" generics="T extends { id: string }">
	import Icon from '@iconify/svelte';
	import type { CollectionState } from '../stores/collectionStore';

	interface GridField {
		key: keyof T | string;
		label?: string;
		render?: (item: T, value: any) => string;
		icon?: boolean;
		date?: boolean;
		primary?: boolean; // Main field to display prominently
		secondary?: boolean; // Secondary info
		badge?: boolean; // Show as a badge/chip
	}

	interface Props {
		state: CollectionState<T>;
		title?: string;
		fields: GridField[];
		emptyMessage?: string;
		adminUrl?: string;
		columns?: number; // Number of grid columns (default: auto-fit)
		minCardWidth?: string; // Minimum card width (default: 250px)
		onClick?: (item: T) => void; // Optional click handler
	}

	let {
		state,
		title = '',
		fields,
		emptyMessage = 'No items found.',
		adminUrl = 'http://localhost:8090/_/',
		columns,
		minCardWidth = '250px',
		onClick
	}: Props = $props();

	function getValue(item: T, key: string) {
		return key.split('.').reduce((obj: any, k) => obj?.[k], item);
	}

	function renderValue(item: T, field: GridField) {
		const value = getValue(item, field.key as string);

		if (field.render) {
			return field.render(item, value);
		}

		if (field.date && value) {
			return new Date(value).toLocaleDateString();
		}

		return value?.toString() || '';
	}

	function handleCardClick(item: T) {
		if (onClick) {
			onClick(item);
		}
	}

	// Get primary field (first one marked as primary, or first field)
	const primaryField = $derived(fields.find((f) => f.primary) || fields[0]);

	// Get secondary fields (marked as secondary, or remaining fields)
	const secondaryFields = $derived(fields.filter((f) => f.secondary));

	// Get badge fields
	const badgeFields = $derived(fields.filter((f) => f.badge));

	// Get icon field
	const iconField = $derived(fields.find((f) => f.icon));
</script>

<div class="collection-grid">
	{#if state.error}
		<div class="error">
			<Icon icon="mdi:alert-circle" />
			<div>
				<p><strong>Error:</strong> {state.error}</p>
			</div>
		</div>
	{:else}
		<div
			class="grid-container"
			style="--min-card-width: {minCardWidth}; --columns: {columns || 'auto-fit'};"
		>
			{#if !state.initialized}
				<div class="grid-loading">
					<div class="spinner"></div>
					<p>Loading {title.toLowerCase()}...</p>
				</div>
			{:else if state.items.length === 0}
				<div class="grid-empty">
					<Icon icon="mdi:inbox" width="48" height="48" />
					<div>
						<p>{emptyMessage}</p>
						{#if adminUrl}
							<a href={adminUrl} target="_blank">Open PocketBase Admin</a>
						{/if}
					</div>
				</div>
			{:else}
				<div
					class="grid"
					style="grid-template-columns: repeat({columns
						? columns
						: 'auto-fit'}, minmax({minCardWidth}, 1fr));"
				>
					{#each state.items as item (item.id)}
						{#if onClick}
							<button class="card clickable" onclick={() => handleCardClick(item)}>
								{#if iconField}
									{@const iconName = getValue(item, iconField.key as string)}
									<div class="card-icon">
										{#if iconName}
											<Icon icon={iconName} width="32" height="32" />
										{:else}
											<Icon icon="mdi:help-circle" width="32" height="32" />
										{/if}
									</div>
								{/if}

								<div class="card-content">
									{#if primaryField}
										<h3 class="card-title">
											{renderValue(item, primaryField)}
										</h3>
									{/if}

									{#if secondaryFields.length > 0}
										<div class="card-details">
											{#each secondaryFields as field}
												<div class="detail-item">
													{#if field.label}
														<span class="detail-label">{field.label}:</span>
													{/if}
													<span class="detail-value">
														{renderValue(item, field)}
													</span>
												</div>
											{/each}
										</div>
									{/if}

									{#if badgeFields.length > 0}
										<div class="card-badges">
											{#each badgeFields as field}
												{@const value = renderValue(item, field)}
												{#if value}
													<span class="badge">
														{field.label ? `${field.label}: ${value}` : value}
													</span>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							</button>
						{:else}
							<div class="card">
								{#if iconField}
									{@const iconName = getValue(item, iconField.key as string)}
									<div class="card-icon">
										{#if iconName}
											<Icon icon={iconName} width="32" height="32" />
										{:else}
											<Icon icon="mdi:help-circle" width="32" height="32" />
										{/if}
									</div>
								{/if}

								<div class="card-content">
									{#if primaryField}
										<h3 class="card-title">
											{renderValue(item, primaryField)}
										</h3>
									{/if}

									{#if secondaryFields.length > 0}
										<div class="card-details">
											{#each secondaryFields as field}
												<div class="detail-item">
													{#if field.label}
														<span class="detail-label">{field.label}:</span>
													{/if}
													<span class="detail-value">
														{renderValue(item, field)}
													</span>
												</div>
											{/each}
										</div>
									{/if}

									{#if badgeFields.length > 0}
										<div class="card-badges">
											{#each badgeFields as field}
												{@const value = renderValue(item, field)}
												{#if value}
													<span class="badge">
														{field.label ? `${field.label}: ${value}` : value}
													</span>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.collection-grid {
		width: 100%;
	}

	.error {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--errorSecondary);
		color: var(--error);
		border: 1px solid var(--error);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.grid-container {
		width: 100%;
	}

	.grid-loading,
	.grid-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		color: var(--secondaryText);
		text-align: center;
		background: var(--backgroundLight);
		border-radius: 8px;
		border: 1px solid var(--borderColor);
	}

	.grid-empty {
		gap: 1.5rem;
	}

	.grid-empty div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.grid-empty a {
		padding: 0.75rem 1.5rem;
		background: var(--info);
		color: var(--primaryText);
		border: none;
		border-radius: 6px;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
		font-size: 0.9rem;
		box-shadow: var(--shadow-s);
		transition: all 0.2s ease;
	}

	.grid-empty a:hover {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
		transform: translateY(-1px);
	}

	.grid {
		display: grid;
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.card {
		background: var(--backgroundLight);
		border: 1px solid var(--borderColor);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: var(--shadow-s);
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
		color: var(--primaryText);
	}

	.card:hover {
		box-shadow: var(--shadow-m);
		transform: translateY(-2px);
		border-color: var(--info);
	}

	.card.clickable {
		cursor: pointer;
		background: var(--backgroundLight);
	}

	.card.clickable:hover {
		background: var(--background);
	}

	.card.clickable:focus {
		outline: 2px solid var(--info);
		outline-offset: 2px;
	}

	.card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: var(--background);
		border-radius: 50%;
		align-self: center;
		color: var(--info);
		border: 2px solid var(--borderColor);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.card-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--primaryText);
		line-height: 1.3;
	}

	.card-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-item {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.detail-label {
		color: var(--secondaryText);
		font-weight: 500;
		min-width: fit-content;
	}

	.detail-value {
		color: var(--primaryText);
		flex: 1;
		word-break: break-word;
	}

	.card-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--info);
		color: var(--primaryText);
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--borderColor);
		border-top: 3px solid var(--info);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.card {
			padding: 1rem;
		}

		.card-icon {
			width: 48px;
			height: 48px;
		}
	}
</style>
