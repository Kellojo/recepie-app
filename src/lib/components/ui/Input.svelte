<script lang="ts">
	interface Props {
		id?: string;
		label: string;
		type?: 'text' | 'email' | 'password' | 'number';
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		helpText?: string;
		bind?: any;
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder,
		required = false,
		disabled = false,
		error,
		helpText
	}: Props = $props();
</script>

<div class="form-group">
	<label for={id}>
		{label}
		{#if required}
			<span class="required">*</span>
		{/if}
	</label>
	<input {id} {type} bind:value {placeholder} {required} {disabled} class:error />
	{#if error}
		<div class="error-message">{error}</div>
	{/if}
	{#if helpText}
		<div class="help-text">{helpText}</div>
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

	.required {
		color: var(--error);
		margin-left: 2px;
	}

	input {
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
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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

	.error-message {
		color: var(--error);
		font-size: 0.8rem;
		margin-top: -0.25rem;
	}

	.help-text {
		color: var(--secondaryText);
		font-size: 0.8rem;
		margin-top: -0.25rem;
	}
</style>
