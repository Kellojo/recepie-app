<script lang="ts" generics="T extends { id: string }">
	import Icon from '@iconify/svelte';
	import type { CollectionState } from '../stores/collectionStore';

	interface Props {
		state: CollectionState<T>;
		title?: string;
		columns: {
			key: keyof T | string;
			label: string;
			render?: (item: T, value: any) => string;
			icon?: boolean;
			date?: boolean;
			width?: string; // CSS width value like '15%', '120px', 'auto', etc.
			minWidth?: string; // CSS min-width value
		}[];
		emptyMessage?: string;
		adminUrl?: string;
		onRowClick?: (item: T) => void; // Optional row click handler
	}

	let {
		state,
		title = '',
		columns,
		emptyMessage = 'No items found.',
		adminUrl = 'http://localhost:8090/_/',
		onRowClick
	}: Props = $props();

	function getValue(item: T, key: string) {
		return key.split('.').reduce((obj: any, k) => obj?.[k], item);
	}

	function renderValue(item: T, column: (typeof columns)[0]) {
		const value = getValue(item, column.key as string);

		if (column.render) {
			return column.render(item, value);
		}

		if (column.date && value) {
			return new Date(value).toLocaleDateString();
		}

		return value?.toString() || '';
	}
</script>

<div class="collection-list">
	{#if state.error}
		<div class="error">
			<Icon icon="mdi:alert-circle" />
			<div>
				<p><strong>Error:</strong> {state.error}</p>
			</div>
		</div>
	{:else}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						{#each columns as column}
							<th
								class="col-{String(column.key)}"
								style="{column.width ? `width: ${column.width};` : ''}{column.minWidth
									? `min-width: ${column.minWidth};`
									: ''}"
							>
								{column.label}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#if !state.initialized}
						<tr>
							<td colspan={columns.length} class="loading-cell">
								<div class="table-loading">
									<div class="spinner"></div>
									<p>Loading {title.toLowerCase()}...</p>
								</div>
							</td>
						</tr>
					{:else if state.items.length === 0}
						<tr>
							<td colspan={columns.length} class="empty-cell">
								<div class="table-empty">
									<Icon icon="mdi:inbox" width="32" height="32" />
									<div>
										<p>{emptyMessage}</p>
										{#if adminUrl}
											<a href={adminUrl} target="_blank">Open PocketBase Admin</a>
										{/if}
									</div>
								</div>
							</td>
						</tr>
					{:else}
						{#each state.items as item (item.id)}
							<tr
								class:clickable-row={onRowClick}
								onclick={() => onRowClick?.(item)}
								role={onRowClick ? 'button' : undefined}
								tabindex={onRowClick ? 0 : undefined}
							>
								{#each columns as column}
									<td
										class="col-{String(column.key)}"
										style="{column.width ? `width: ${column.width};` : ''}{column.minWidth
											? `min-width: ${column.minWidth};`
											: ''}"
									>
										{#if column.icon}
											{@const iconName = getValue(item, column.key as string)}
											{#if iconName}
												<Icon icon={iconName} width="24" height="24" />
											{:else}
												<Icon icon="mdi:help-circle" width="24" height="24" />
											{/if}
										{:else}
											{renderValue(item, column)}
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.collection-list {
		padding: 2rem 0;
		max-width: 1200px;
		margin: 0 auto;
	}

	.stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		background: var(--backgroundLight);
		border-radius: 4px;
		border-left: 4px solid var(--info);
		color: var(--secondaryText);
		font-size: 0.9rem;
	}

	.loading,
	.error,
	.empty {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 3rem 2rem;
		border-radius: 8px;
		text-align: left;
	}

	.loading {
		background: var(--backgroundLight);
		color: var(--secondaryText);
		border: 1px solid var(--borderColor);
		justify-content: center;
		flex-direction: column;
		text-align: center;
	}

	.error {
		background: var(--errorSecondary);
		color: var(--error);
		border: 1px solid var(--error);
	}

	.loading-cell,
	.empty-cell {
		padding: 0;
		border: none;
	}

	.table-loading,
	.table-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		color: var(--secondaryText);
		text-align: center;
	}

	.table-empty {
		gap: 1rem;
	}

	.table-empty div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.table-empty a {
		margin-top: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--info);
		color: var(--primaryText);
		border: none;
		border-radius: 4px;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
		font-size: 0.9rem;
		box-shadow: var(--shadow-s);
	}

	.table-empty a:hover {
		background: var(--info);
		filter: brightness(1.1);
		box-shadow: var(--shadow-m);
	}

	.table-container {
		background: var(--backgroundLight);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: var(--shadow-m);
		border: 1px solid var(--borderColor);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	th,
	td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid var(--borderColor);
		color: var(--primaryText);
		max-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	th {
		background: var(--background);
		font-weight: 600;
		color: var(--primaryText);
		border-bottom: 1px solid var(--borderColor);
	}

	tbody tr:hover {
		background: var(--background);
	}

	.clickable-row {
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.clickable-row:hover {
		background: var(--backgroundLight) !important;
	}

	.clickable-row:focus {
		outline: 2px solid var(--info);
		outline-offset: -2px;
	}

	.clickable-row {
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.clickable-row:hover {
		background: var(--backgroundLight) !important;
	}

	.clickable-row:focus {
		outline: 2px solid var(--info);
		outline-offset: -2px;
	}

	/* Default column styles - widths are now controlled via props */
	.col-id {
		font-family: monospace;
		font-size: 0.9rem;
		color: var(--secondaryText);
	}

	.col-icon {
		text-align: center;
		white-space: normal;
		overflow: visible;
		text-overflow: unset;
	}

	.col-name {
		font-weight: 500;
	}

	.col-created,
	.col-updated {
		color: var(--secondaryText);
		font-size: 0.9rem;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid var(--borderColor);
		border-top: 2px solid var(--info);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.collection-list {
			padding: 1rem;
		}

		.header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		table {
			font-size: 0.9rem;
		}

		th,
		td {
			padding: 0.75rem 0.5rem;
		}

		.col-id {
			display: none;
		}
	}
</style>
