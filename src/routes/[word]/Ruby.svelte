<script lang="ts">
	export let simplified: string;
	export let traditional: string;
	export let simpComparison: string;
	export let tradComparison: string;
	export let pinyin: string;

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

	function isAlphaNumeric(str) {
		var code, i, len;
		for (i = 0, len = str.length; i < len; i++) {
			code = str.charCodeAt(i);
			if (
				!(code > 47 && code < 58) && // numeric (0-9)
				!(code > 64 && code < 91) && // upper alpha (A-Z)
				!(code > 96 && code < 123) // lower alpha (a-z)
			) {
				return false;
			}
		}
		return true;
	}

	function formatWord(word: string) {
		let formattedWord = '';
		console.log(word);
		for (let char of word) {
			if (isAlphaNumeric(char)) {
				formattedWord += `<span class="fullwidth">${char}</span>`;
			} else {
				formattedWord += char;
			}
		}
		return formattedWord;
	}

	import { isSimplifiedMode } from '$lib/store';

	const isSimplified = isSimplifiedMode();

	console.log(simplified, traditional, simpComparison, tradComparison, pinyin);
</script>

<div class="ruby">
	{#if $isSimplified}
		<div class="ruby-text">
			{#if pinyin}
				{#each pinyin.split(' ') as p}
					<div class={`tone${getTone(p)}`}>{p}</div>
				{/each}
			{/if}
		</div>
		<h1 class="word">
			{@html formatWord(simplified)}
		</h1>
		{#if traditional && traditional != simplified}
			<h1 class="word">
				{@html formatWord(tradComparison)}
			</h1>
		{/if}
	{:else}
		<div class="ruby-text">
			{#each pinyin.split(' ') as p}
				<div class={`tone${getTone(p)}`}>{p}</div>
			{/each}
		</div>
		<h1 class="word">
			{@html formatWord(traditional)}
		</h1>
		{#if simplified && traditional != simplified}
			<h1 class="word">
				{@html formatWord(simpComparison)}
			</h1>
		{/if}
	{/if}
</div>

<style>
	.ruby {
		display: inline-block;
	}
	h1 {
		font-size: 3rem;
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
