<script lang="ts">
  interface Props {
    title?: string
    description?: string
    keywords?: string
    image?: string
    type?: string
    canonicalUrl?: string
    robots?: string
  }

  import { page } from "$app/state"

  let {
    title = "Chris J Mears",
    description = "I'm an aspiring Machine Learning Engineer specializing in Analytics Engineering, with expertise in Full-Stack Engineering, Data Visualization, and Healthcare Analysis",
    keywords = "analytics engineer, data engineer, data analyst, senior-level, software engineer, machine learning engineer, svelte, python, sql, javascript, typescript, data analysis, machine learning, ai",
    image = "/og-home.png",
    type = "website",
    canonicalUrl,
    robots,
  }: Props = $props()

  // Ensure title has site name
  let fullTitle = $derived(
    title && title.includes("Chris J Mears")
      ? title
      : `${title} | Chris J Mears`
  )

  // Compute canonical from current page if not provided
  let canonical = $derived(
    canonicalUrl ?? `${page.url.origin}${page.url.pathname}`
  )

  // Ensure og:image is absolute for social crawlers
  let ogImage = $derived(
    image?.startsWith("http") ? image : `${page.url.origin}${image}`
  )
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  {#if robots}
    <meta name="robots" content={robots} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={canonical} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonical} />
</svelte:head>
