<script lang="ts">
	import Component from './Component.svelte';
	import Substring from './Substring.svelte';
	export let data: any;

	console.log(data);
	import Toggle from './Toggle.svelte';

	let isTraditional = false;
	const toneMarks = ['āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ'];
	function getTone(syllable: string) {
		syllable = syllable.replace(/\d/, '');

		for (let tone = 0; tone < toneMarks.length; tone++) {
			for (let char of toneMarks[tone]) {
				if (syllable.includes(char)) {
					return tone + 1;
				}
			}
		}

		return 5;
	}
</script>

<Toggle on:switchChanged={(e) => (isTraditional = e.detail)} />

{#each data.entries as entry}
	{#if !isTraditional}
		<!-- <h1 class="word">
			<ruby>
				{#each entry.simpRuby as ruby}
					{ruby.c}<rt class={`tone${ruby.t}`}>{ruby.p}</rt>
				{/each}
			</ruby>
		</h1> -->

		<div class="ruby-text">
			{#each entry.pinyin.split(' ') as pinyin}
				<div class={`tone${getTone(pinyin)}`}>{pinyin}</div>
			{/each}
		</div>

		<h1 class="word">{entry.simplified}</h1>
		{#if entry.traditional && entry.traditional != entry.simplified}
			<h1 class="word">{entry.tradComparison}</h1>
		{/if}
	{:else}
		<!-- <h1 class="word">
			<ruby>
				{#each entry.tradRuby as ruby}
					{ruby.c}<rt class={`tone${ruby.t}`}>{ruby.p}</rt>
				{/each}
			</ruby>
		</h1> -->

		<div class="ruby-text">
			{#each entry.pinyin.split(' ') as pinyin}
				<div class={`tone${getTone(pinyin)}`}>{pinyin}</div>
			{/each}
		</div>

		<h1 class="word">{entry.traditional}</h1>

		{#if entry.simplified && entry.traditional != entry.simplified}
			<h1 class="word">{entry.simpComparison}</h1>
		{/if}
	{/if}

	<!-- {#if entry.tradRuby}
			/
			<ruby
				>{#each entry.tradRuby as ruby}{ruby.c}<rt class={`tone${ruby.t}`}>{ruby.p}</rt>{/each}</ruby
		>{/if} -->
	<p>
		{entry.simplified}{entry.traditional && entry.traditional != entry.simplified
			? ` / ${entry.traditional}`
			: ''}
	</p>

	<p>{entry.pinyin}</p>
	<p>{entry.definition}</p>
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
	h1 {
		font-size: 3rem;
	}

	rt {
		font-size: 1rem;
		font-weight: normal;
	}

	.word {
		margin: -0.2em 0;
	}

	.ruby-text {
		display: flex;
	}

	.ruby-text div {
		width: 3rem;
		text-align: center;
	}
</style>
