<script lang="ts">
	import Component from './Component.svelte';
	import Ruby from './Ruby.svelte';
	import Substring from './Substring.svelte';
	export let data: any;

	console.log(data);
	import Toggle from './Toggle.svelte';

	import { isSimplifiedMode } from '$lib/store';

	const isSimplified = isSimplifiedMode();
</script>

<Toggle />

<div class="word-head">
	{#each data.entries as entry}
		<Ruby {...entry} />

		<p>{entry.definition}</p>
	{/each}
</div>

{#each data.substrings as substring}
	<Substring {substring} />

	{#if substring.components}
		{#each substring.components as component}
			<Component {component} />
		{/each}
	{/if}
{/each}

<!-- <h1>{data.word}{data.entries[0][2] ? ` / ${data.entries[0][2]}` : '' }</h1>
<h1><ruby>
	{#each data.simpRuby as ruby}
		{ruby.c}<rt>{ruby.p}</rt>
	{/each}
</ruby> /
<ruby>{#each data.tradRuby as ruby}{ruby.c}<rt>{ruby.p}</rt>{/each}</ruby></h1>
{#each data.entries as entry}
    <h2>{data.entries[0][2] != entry[2] ? `${entry[2]} - ` : '' }{entry[0]}</h2>
    <p>{entry[1]}</p>
{/each}

{#each data.substrings as substring}
	<Substring {substring} level={1} />

	{#if substring.components}
		{#each substring.components as component}
			<Component {component} level={2} />
		{/each}
	{/if}
{/each} -->

<style>
	.word-head {
		display: inline-block;
	}
</style>
