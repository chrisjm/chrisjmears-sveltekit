<script lang="ts">
  import Hero from "$lib/components/Hero.svelte"
  import Projects from "$lib/components/Projects.svelte"
  import AboutMe from "$lib/components/AboutMe.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"
	import ogImageSrc from '$lib/assets/home/cjm-open-graph.jpg';
	import SEO from '$lib/components/SEO/index.svelte';
  import type { PageData } from "./$types"
  import MostRecentBlogPosts from "$lib/components/MostRecentBlogPosts.svelte"

  export let data: PageData

	let title = 'Home';

  let metadescription =
		'Chris J Mears - Software Engineer, Open Brewery DB Maintainer, nerdy guy.';

  const featuredImageAlt =
		'title card of a person and the text "Hi, my name is Chris."';

	const ogImage = {
		url: ogImageSrc,
		alt: featuredImageAlt,
	};

	const seoProps = {
		title,
		slug: '',
		datePublished: '2021-07-07T14:19:33.000+0100',
		lastUpdated: '2021-07-07T14:19:33.000+0100',
		metadescription,
		ogImage,
	};
</script>

<Hero />
<Projects />
<AboutMe />
<MostRecentBlogPosts posts={data.recentPosts} />
<NewsletterSignup />
