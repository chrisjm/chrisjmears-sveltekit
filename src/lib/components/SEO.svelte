<script lang="ts">
  interface Props {
    title?: string
    description?: string
    keywords?: string
    image?: string
    type?: string
    canonicalUrl?: string
  }

  import { page } from "$app/state"

  let {
    title = "Chris J Mears",
    description = "I'm an aspiring Machine Learning Engineer with expertise in Software Engineering, Data Visualization, Healthcare Analysis, and AI",
    keywords = "analytics engineer, data engineer, data analyst, senior-level, software engineer, machine learning engineer, svelte, python, sql, javascript, typescript, data analysis, machine learning, ai",
    image = "https://res.cloudinary.com/wanderingleafstudios/image/upload/w_1200,h_630,c_fill/v1754957957/cjm-opengraph-20250811.jpg",
    type = "website",
    canonicalUrl,
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
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={canonical} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonical} />
</svelte:head>
