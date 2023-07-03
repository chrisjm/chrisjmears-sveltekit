<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: component = data.component;
</script>

<svelte:component this={component} />
