<script lang="ts">
	import Component from './Component.svelte';
	import Ruby from './Ruby.svelte';
	export let component;

	console.log(component);
</script>

<div style="padding-left: 1rem">
	<details open>
		<summary>
			{#if component.entries}
				<div class="word-head">
					{#each component.entries as entry}
						<Ruby {...entry} />
						<p>{entry.definition}</p>
					{/each}
				</div>
			{:else}
				<div class="word-head">
					<h1>{component.word}</h1>
				</div>
			{/if}
			<!-- {#if component.entries} -->
			<!-- {#each component.entries as entry}
					<h2>{component.entries[0][2] != entry[2] ? `${entry[2]} - ` : ''}{entry[0]}</h2>
					<p>{entry[1]}</p>
				{/each} -->
			<!-- {/if} -->
		</summary>
		{#if component.components}
			{#each component.components as c}
				<Component component={c} />
			{/each}
		{/if}
	</details>
</div>

<style>
	h1 {
		font-size: 3rem;
	}
	.word-head {
		display: inline-block;
	}
</style>
