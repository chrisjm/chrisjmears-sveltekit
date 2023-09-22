<script lang="ts">
  // TODO: Create default assets and favicons
  import ogSquareImageSrc from "$lib/assets/home/home-open-graph-square.jpg"
  import ogImageSrc from "$lib/assets/home/home-open-graph.jpg"

  import OpenGraph from "./OpenGraph.svelte"

  const ogLanguage = "en_US"
  const siteTitle = "Chris J Mears"
  const siteUrl = "https://chrisjmears.com"

  export let article = false
  export let lastUpdated: string
  export let datePublished: string
  export let metadescription: string
  export let slug: string
  export let title: string

  const defaultAlt = "Chris J Mears Homepage Screenshot"

  export let ogImage = {
    url: ogImageSrc,
    alt: defaultAlt,
  }
  export let ogSquareImage = {
    url: ogSquareImageSrc,
    alt: defaultAlt,
  }
  const url = `${siteUrl}/${slug}`
  const pageTitle = `${siteTitle} | ${title}`
  const openGraphProps = {
    article,
    datePublished,
    lastUpdated,
    image: ogImage,
    squareImage: ogSquareImage,
    metadescription,
    ogLanguage,
    pageTitle,
    siteTitle,
    url,
    ...(article ? { datePublished, lastUpdated } : {}),
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={metadescription} />
  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  />
</svelte:head>
<OpenGraph {...openGraphProps} />
