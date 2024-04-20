<script lang="ts">
    export let simpRuby;
    export let tradRuby;
    export let simp;
    export let trad;
</script>

<h1><ruby>
	{#each simpRuby as ruby}
		{ruby.c}<rt>{ruby.p}</rt>
	{/each}
</ruby> /
<ruby>{#each tradRuby as ruby}{ruby.c}<rt>{ruby.p}</rt>{/each}</ruby></h1>
