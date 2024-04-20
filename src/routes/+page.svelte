<script lang="ts">
	import { goto } from '$app/navigation';
	let word: string = '';

	function goToWord() {
		word && goto(`/${word}`);
	}
</script>

<h1>Kiokun</h1>

<p>Chinese and Japanese Etymology Dictionary (WIP)</p>

<p>Search word</p>

<input type="text" bind:value={word} on:keydown={(e) => e.key === 'Enter' && goToWord()} />
<button on:click={goToWord}>Go</button>

<p>Samples:</p>
<ul>
	<li><a href="/2019冠狀病毒病">2019冠狀病毒病</a></li>
</ul>

<hr />
<p>By <a href="https://hakanalpay.com">kimeiga</a></p>
