<script lang="ts">
	import { goto } from '$app/navigation';
	let word: string = '';

	function goToWord() {
		word && goto(`/${word}`);
	}
</script>

<div class="search-bar">
	<input
		type="text"
		bind:value={word}
		on:keydown={(e) => e.key === 'Enter' && goToWord()}
		placeholder="Search word"
	/>
	<button on:click={goToWord}>Go</button>
</div>

<style>
</style>
