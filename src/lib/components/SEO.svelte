<script lang="ts">
  interface Props {
    title?: string
    description?: string
    keywords?: string
    image?: string
    type?: string
    canonicalUrl?: string
  }

  let {
    title = "Chris J Mears - Full Stack Developer",
    description = "Full Stack Developer specializing in JavaScript, TypeScript, React, and Node.js",
    keywords = "full stack developer, javascript, typescript, react, node.js",
    image = "https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1543031975/chrisjmears.com/chris-mears-profile-2018.jpg",
    type = "website",
    canonicalUrl = "https://chrisjmears.com",
  }: Props = $props()

  // Ensure title has site name
  let fullTitle = $state(
    title.includes("Chris J Mears") ? title : `${title} | Chris J Mears`,
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

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />

  <!-- Schema.org structured data -->
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Chris J Mears",
      "url": "https://chrisjmears.com",
      "image": image,
      "description": description,
      "sameAs": [
        "https://github.com/chrisjm",
        "https://linkedin.com/in/chrisjm"
      ]
    })}
  </script>
</svelte:head>
