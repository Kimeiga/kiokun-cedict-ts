<script>
	import { isSimplifiedMode } from '$lib/store';

	const isSimplified = isSimplifiedMode();
	function toggleSwitch() {
		isSimplified.update((value) => !value);
	}
</script>

<div class="toggle-container">
	<div
		class="toggle-switch"
		class:traditional={!$isSimplified}
		role="button"
		tabindex="0"
		on:click={toggleSwitch}
		on:keydown
	>
		<div class="switch-background">
			<div class="character simplified" class:active={$isSimplified}>简</div>
			<div class="character traditional" class:active={!$isSimplified}>繁</div>
		</div>
		<div class="switch-circle"></div>
	</div>
</div>

<style>
	.toggle-container {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 9999;
	}

	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 75px;
		height: 40px;
		background-color: #94a3b8;
		border-radius: 20px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.switch-background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.character {
		font-size: 20px;
		color: #000;
		transition: color 0.3s;
		z-index: 1;
	}

	.character.active {
		color: #fff;
	}

	.switch-circle {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 36px;
		height: 36px;
		background-color: #475569;
		border-radius: 50%;
		transition: transform 0.3s;
	}

	.toggle-switch.traditional .switch-circle {
		transform: translateX(35px);
	}
</style>
