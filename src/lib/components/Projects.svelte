<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import Heading2 from "$lib/components/Heading2.svelte"
  import ProjectCard from "$lib/components/ProjectCard.svelte"

  const projects = [
    {
      id: "brewery-nlp",
      title: "Brewery Review Analysis with NLP and NER",
      description:
        "The final Springboard Data Science Career Track Capstone project using natural language processing and named entity recognition.",
      tags: ["nlp", "spaCy"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/v1613356659/chrisjmears.com/Brewery_Review_NLP_-_Springboard_Data_Science_-_Final_Capstone.jpg",
      imageAlt: "Brewery Review Analysis with NLP and NER title slide",
      links: [
        {
          url: "https://github.com/chrisjm/brewery-review-nlp/blob/main/README.md",
          text: "View Report",
        },
        {
          url: "https://github.com/chrisjm/brewery-review-nlp/raw/main/reports/Brewery%20Review%20NLP%20-%20Springboard%20Data%20Science%20-%20Final%20Capstone.pdf",
          text: "View Presentation",
        },
        {
          url: "https://www.youtube.com/watch?v=04svmI8TTOY",
          text: "Watch Video (25m)",
        },
      ],
    },
    {
      id: "credit-card-fraud-analysis",
      title: "Credit Card Fraud Analysis and Detection",
      description:
        "Springboard Data Science Career Track capstone project that analyzes and fits various classification models to an imbalanced credit card fraud dataset.",
      tags: ["scikit-learn"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/v1602041852/chrisjmears.com/model-evaluation-prauc.png",
      imageAlt: "Precision Recall AUC model evaluation plot",
      links: [
        {
          text: "View Report",
          url: "https://github.com/chrisjm/Credit-Card-Fraud-Analysis/blob/master/README.md",
        },
        {
          url: "https://github.com/chrisjm/Credit-Card-Fraud-Analysis/raw/master/reports/Capstone%20Slides%20-%20Credit%20Card%20Fraud.pdf",
          text: "View Presentation",
        },
      ],
    },
    {
      id: "obdb",
      title: "Open Brewery DB",
      description:
        "Open Brewery DB is a free and open-source dataset and API with public information on breweries, cideries, brewpubs, and bottleshops. It is also a growing Discord community of beer-loving developers and data scientists.",
      tags: ["open-source", "api"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/v1572317242/openbrewerydb/OpenBreweryDBLogo.jpg",
      imageAlt: "Open Brewery DB Logo",
      links: [
        {
          text: "View Website",
          url: "https://www.openbrewerydb.org",
        },
        {
          text: "Join Discord Server",
          url: "https://discord.gg/3G3syaD",
        },
      ],
    },
    {
      id: "data-nerd-newsletter",
      title: "Data Nerd Newsletter",
      description:
        "The archives for my weekly newsletter where I breakdown data and machine learning topics.",
      tags: ["newsletter"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/v1587682706/chrisjmears.com/data-nerd-newsletter-og.jpg",
      imageAlt: "Data Nerd Newsletter",
      links: [
        {
          text: "View Archives",
          url: "/data-nerd-newsletter",
        },
      ],
    },
    {
      id: "tea-quiz",
      title: "Tea Quiz",
      description:
        "A small project to demonstrate a simple web-based ReactJS quiz app to collect data.",
      tags: ["reactjs"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/v1576648921/chrisjmears.com/christine-wehrmeier-l4MCijLHc0Q-unsplash.jpg",
      imageAlt: "Tea field",
      links: [
        {
          text: "Take Quiz",
          url: "https://tea-quiz.wanderingleafstudios.com/",
        },
      ],
    },
  ]
</script>

<Section>
  <Heading2 title="Projects" />
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
    {#each projects as project (project.id)}
      <ProjectCard {...project} />
    {/each}
  </div>
</Section>
