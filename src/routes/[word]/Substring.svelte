<script lang="ts">
	import Component from './Component.svelte';
	import Ruby from './Ruby.svelte';
	import Substring from './Substring.svelte';

	export let substring: Substring;
</script>

<div>
	<details open>
		<summary>
			<div class="word-head">
				{#each substring.entries as entry}
					<Ruby {...entry} />
					<p>{entry.definition}</p>
				{/each}
			</div>
		</summary>

		{#if substring.substrings}
			<div class="substrings">
				{#each substring.substrings as substring}
					<Substring {substring} />
				{/each}
			</div>
		{/if}

		{#if substring.components}
			<div class="components">
				{#each substring.components as component}
					<Component {component} />
				{/each}
			</div>
		{/if}
	</details>
</div>

<style>
	.subword {
		font-size: 2rem;
	}

	.word-head {
		display: inline-block;
	}
</style>
