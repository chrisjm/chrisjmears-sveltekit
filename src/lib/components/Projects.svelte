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
      id: "ml-project-checklist",
      title: "Machine Learning Project Checklist",
      description:
        "A checklist for machine learning projects based on <em><a href='https://homl.info/' target='_blank' rel='noopener noreferrer'>Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow</a></em> by Aurélien Géron.",
      tags: ["svelte", "machine learning"],
      imageUrl:
        "https://res.cloudinary.com/wanderingleafstudios/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1755146140/chrisjmears.com/dog-checklist-computer.jpg",
      imageAlt: "Machine Learning Project Checklist",
      links: [
        {
          text: "View Project",
          url: "https://ml-project-checklist.chrisjmears.com/",
        },
        {
          text: "View Source",
          url: "https://github.com/chrisjm/ml-project-checklist",
        },
      ],
    },
    {
      id: "kirtan-kriya-timer",
      title: "Kirtan Kriya Timer",
      description:
        "A meditation timer for practicing Kirtan Kriya, a meditation technique from the Kundalini yoga tradition.",
      tags: ["meditation", "timer"],
      imageUrl: "/images/kirtan-kriya-timer-og-bg.jpg",
      imageAlt: "Kirtan Kriya Timer",
      links: [
        {
          text: "View Website",
          url: "https://www.kirtan-kriya-timer.com/",
        },
      ],
    },
    {
      id: "meditation-timer",
      title: "Meditation Timer",
      description:
        "A simple meditation timer to enhance your practice with gentle interval bells and healing solfeggio frequencies.",
      tags: ["meditation", "timer", "solfeggio"],
      imageUrl: "/images/og-bg-v3-dark.png",
      imageAlt: "Meditation Timer",
      links: [
        {
          text: "View Website",
          url: "https://meditation.wanderingleafstudios.com/",
        },
      ],
    },
  ]
</script>

<Section>
  <Heading2 title="Projects" />
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3">
    {#each projects as project (project.id)}
      <ProjectCard {...project} />
    {/each}
  </div>
</Section>
