import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

interface CaseStudy {
  slug: string
  title: string
  description: string
  tags: string[]
  links?: Array<{ url: string; text: string }>
}

const caseStudies: Record<string, CaseStudy> = {
  "kirtan-kriya-timer": {
    slug: "kirtan-kriya-timer",
    title: "Kirtan Kriya Timer",
    description:
      "A meditation timer for practicing Kirtan Kriya, a meditation technique from the Kundalini yoga tradition. Built with modern web technologies to provide a seamless, distraction-free meditation experience.",
    tags: ["Svelte", "Web App", "Meditation", "Timer"],
    links: [
      {
        url: "https://www.kirtan-kriya-timer.com/",
        text: "View Live Site",
      },
    ],
  },
  "meditation-timer": {
    slug: "meditation-timer",
    title: "Meditation Timer",
    description:
      "A simple meditation timer to enhance your practice with gentle interval bells and healing solfeggio frequencies. Designed for practitioners who want customizable meditation sessions with audio cues.",
    tags: ["Svelte", "Web App", "Audio", "Meditation"],
    links: [
      {
        url: "https://meditation.wanderingleafstudios.com/",
        text: "View Live Site",
      },
    ],
  },
  "ml-project-checklist": {
    slug: "ml-project-checklist",
    title: "Machine Learning Project Checklist",
    description:
      "An interactive checklist for machine learning projects based on 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow' by Aurélien Géron. Helps data scientists and ML engineers follow best practices throughout their project lifecycle.",
    tags: ["Svelte", "Machine Learning", "Tools", "Open Source"],
    links: [
      {
        url: "https://ml-project-checklist.chrisjmears.com/",
        text: "View Live Site",
      },
      {
        url: "https://github.com/chrisjm/ml-project-checklist",
        text: "View Source Code",
      },
    ],
  },
  "open-brewery-db": {
    slug: "open-brewery-db",
    title: "Open Brewery DB",
    description:
      "Open Brewery DB is a free and open-source dataset and API with public information on breweries, cideries, brewpubs, and bottleshops. Serving an average of 35k requests per week, it's become a go-to resource for developers learning APIs and building side projects. The project includes a growing Discord community of beer-loving developers.",
    tags: ["API", "Open Source", "Data Pipeline", "Community"],
    links: [
      {
        url: "https://www.openbrewerydb.org",
        text: "View Website",
      },
      {
        url: "https://discord.gg/3G3syaD",
        text: "Join Discord Community",
      },
    ],
  },
  "brewery-nlp": {
    slug: "brewery-nlp",
    title: "Brewery Review Analysis with NLP and NER",
    description:
      "A comprehensive natural language processing project analyzing brewery reviews using named entity recognition. This was the final capstone project for the Springboard Data Science Career Track, demonstrating advanced NLP techniques and sentiment analysis on real-world data.",
    tags: ["NLP", "spaCy", "Python", "Data Science", "Machine Learning"],
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
        text: "Watch Video (25 minutes)",
      },
    ],
  },
  "credit-card-fraud": {
    slug: "credit-card-fraud",
    title: "Credit Card Fraud Detection",
    description:
      "A machine learning project analyzing and fitting various classification models to an imbalanced credit card fraud dataset. This Springboard Data Science Career Track capstone project demonstrates techniques for handling class imbalance and evaluating model performance on fraud detection tasks.",
    tags: ["scikit-learn", "Classification", "Python", "Machine Learning"],
    links: [
      {
        url: "https://github.com/chrisjm/Credit-Card-Fraud-Analysis/blob/master/README.md",
        text: "View Report",
      },
      {
        url: "https://github.com/chrisjm/Credit-Card-Fraud-Analysis/raw/master/reports/Capstone%20Slides%20-%20Credit%20Card%20Fraud.pdf",
        text: "View Presentation",
      },
    ],
  },
  "neural-network-demo": {
    slug: "neural-network-demo",
    title: "Interactive Neural Network Demo",
    description:
      "A simple interactive 2D classification demo built with C++, OpenGL, and WebAssembly (WASM). This project demonstrates real-time neural network training and visualization in the browser, allowing users to experiment with different datasets and network architectures.",
    tags: ["C++", "OpenGL", "WASM", "Neural Networks", "Visualization"],
    links: [
      {
        url: "/neural-net-demo",
        text: "View Live Demo",
      },
    ],
  },
}

export const load: PageLoad = ({ params }) => {
  const caseStudy = caseStudies[params.slug]

  if (!caseStudy) {
    throw error(404, "Case study not found")
  }

  return caseStudy
}
