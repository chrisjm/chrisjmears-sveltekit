<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import Heading2 from "$lib/components/Heading2.svelte"
  import SEO from "$lib/components/SEO.svelte"

  const services = [
    {
      id: "building-web-apps",
      title: "Building Web Apps",
      description:
        "I design and develop modern web applications with a focus on user experience and performance. From meditation timers to machine learning tools, I create intuitive applications that solve real problems. My expertise spans JavaScript/TypeScript, Svelte, and full-stack development.",
      projects: [
        {
          title: "Kirtan Kriya Timer",
          description: "A meditation timer for Kirtan Kriya practice",
          slug: "kirtan-kriya-timer",
          tags: ["Svelte", "Web App", "Meditation"],
        },
        {
          title: "Meditation Timer",
          description:
            "Simple meditation timer with interval bells and solfeggio frequencies",
          slug: "meditation-timer",
          tags: ["Svelte", "Web App", "Audio"],
        },
        {
          title: "ML Project Checklist",
          description:
            "Interactive checklist for machine learning project workflows",
          slug: "ml-project-checklist",
          tags: ["Svelte", "Machine Learning", "Tools"],
        },
      ],
    },
    {
      id: "data-engineering",
      title: "Data Engineering",
      description:
        "I build robust data pipelines, APIs, and infrastructure that scale. With experience maintaining systems handling millions of requests monthly, I specialize in creating reliable, well-documented data solutions. My work includes API design, data collection strategies, and community-driven open-source projects.",
      projects: [
        {
          title: "Open Brewery DB",
          description:
            "Free API serving 35k requests/week with public brewery data",
          slug: "open-brewery-db",
          tags: ["API", "Open Source", "Data Pipeline"],
        },
      ],
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      description:
        "I transform data into actionable insights using machine learning, natural language processing, and statistical analysis. From fraud detection to sentiment analysis, I apply rigorous analytical methods to solve complex business problems. My approach combines technical expertise with clear communication of findings.",
      projects: [
        {
          title: "Brewery Review NLP Analysis",
          description:
            "Natural language processing and named entity recognition on brewery reviews",
          slug: "brewery-nlp",
          tags: ["NLP", "spaCy", "Python"],
        },
        {
          title: "Credit Card Fraud Detection",
          description:
            "Classification models for imbalanced fraud detection datasets",
          slug: "credit-card-fraud",
          tags: ["scikit-learn", "Classification", "Python"],
        },
        {
          title: "Interactive Neural Network Demo",
          description: "2D classification visualization built with C++ and WASM",
          slug: "neural-network-demo",
          tags: ["C++", "OpenGL", "WASM"],
        },
      ],
    },
  ]
</script>

<SEO
  title="Services - Chris J Mears"
  description="Consulting services in app development, data engineering, and data analysis. Available for short-term projects and ongoing retainers."
  type="website"
/>

<Section>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Consulting Services</h1>
    <p class="text-xl mb-8 text-gray-700">
      I help businesses build modern applications, engineer robust data
      solutions, and extract insights from complex datasets. Available for
      short-term projects and ongoing retainers.
    </p>

    <div class="mb-12 text-center">
      <a
        href="/contact"
        class="inline-block bg-sky-600 hover:bg-sky-700 text-white! font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        Schedule a Consultation
      </a>
    </div>

    {#each services as service}
      <div class="mb-16">
        <Heading2 title={service.title} />
        <p class="text-lg mb-6 text-gray-700">{service.description}</p>

        <h3 class="text-xl font-semibold mb-4">Featured Projects</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each service.projects as project}
            <a
              href="/case-studies/{project.slug}"
              class="block p-4 border border-gray-200 rounded-lg hover:border-sky-500 hover:shadow-md transition-all"
            >
              <h4 class="font-semibold mb-2">{project.title}</h4>
              <p class="text-sm text-gray-600 mb-3">{project.description}</p>
              <div class="flex flex-wrap gap-2">
                {#each project.tags as tag}
                  <span
                    class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                {/each}
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/each}

    <div class="mt-16 p-8 bg-sky-50 rounded-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Ready to Work Together?</h2>
      <p class="text-lg mb-6 text-gray-700">
        Let's discuss how I can help with your project. I'm available for
        short-term engagements and ongoing retainer relationships.
      </p>
      <a
        href="/contact"
        class="inline-block bg-sky-600 hover:bg-sky-700 text-white! font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        Get in Touch
      </a>
    </div>
  </div>
</Section>
