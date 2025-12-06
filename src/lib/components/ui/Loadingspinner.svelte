<span class="loader"></span>

<style>
	.loader {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		display: inline-block;
		position: relative;
		border: 4px solid;
		border-color: rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.25) rgba(255, 255, 255, 0.35)
			rgba(255, 255, 255, 0.5);
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
