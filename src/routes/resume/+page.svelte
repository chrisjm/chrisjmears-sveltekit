<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"

  const resume = {
    personal: {
      name: "Chris J Mears",
      email: "chris.mears@gmail.com",
      objective:
        "I'm a Data Visualization Engineer and Data Scientist with experience in Machine Learning, NLP, Deep Learning, SQL, Python, and JavaScript.",
      interests: [
        "Rescue dog owner 🐶",
        "Tea, coffee, and craft beer enthusiast 🍵☕️🍺",
      ],
    },
    websites: {
      personal: "https://chrisjmears.com",
      github: "https://github.com/chrisjm",
      linkedin: "https://www.linkedin.com/in/chrisjm80",
    },
    education: [
      {
        school: "Ohio University",
        location: "Athens, OH",
        degree: "Bachelor of Science, Communication Systems Management (2003)",
      },
      {
        school: "Springboard",
        location: "Online",
        degree: "Data Science Career Track, Data Science (April 2020 cohort)",
        description:
          "600+ hours of hands-on curriculum, with 1:1 industry expert mentor oversight, and completion of 2 in-depth capstone projects. Mastering skills in Python, SQL, data analysis, data visualization, hypothesis testing, and machine learning.",
      },
    ],
    experience: [
      {
        company: "Carevoyance",
        position: "Senior Engineer",
        location: "Portland, OR (remote)",
        startDate: "Feb 2021",
        endDate: "Present",
        accomplishments: [
          "Modernized sales platform by converting from AngularJS to Svelte.",
          "Increase customer success team's efficiency by developing client analytics dashboards using Google Data Studio.",
        ],
      },
      {
        company: "Wandering Leaf Studios, LLC",
        position: "Consultant / Owner",
        location: "San Diego, CA",
        startDate: "May 2018",
        endDate: "Present",
        accomplishments: [
          "Increased online sales by over $200k in six months by enhancing the eCommerce solution, configuring data analytics to collect relevant customer data for email marketing, and collaborating on creative solutions for shipping and logistics problems.",
          "Increased sales 50% over the previous year using data analysis, A/B testing, and geo-targeted segmentation with Google AdWords campaigns.",
          "Automated advanced SQL queries and ETL techniques using Apache Airflow to reduce boring weekly administration tasks by over 50%.",
          "Empowered sales, marketing, and executive teams to review core business analytics (KPIs) and discover insights without their engineering teams by architecting data pipelines, configuring cloud data storage systems, and creating custom dashboards.",
          "Delivered understandable and well-written presentations and data story reports with effective data visualizations and clear conclusions.",
        ],
      },
      {
        company: "Goodreads",
        position: "Web Development Engineer II",
        location: "San Francisco, CA",
        startDate: "February 2013",
        endDate: "May 2014",
        accomplishments: [
          "Collaborated in a small team to rebuild the cross-compatible mobile web app version of the website, which received 17-million monthly unique visitors.",
          "Mentored junior team members on web development conventions and best practices.",
        ],
      },
      {
        company: "Canned Banners",
        position: "Technical Co-Founder (Data Engineer)",
        location: "San Francisco, CA",
        startDate: "January 2009",
        endDate: "February 2013",
        accomplishments: [
          "Technical co-founder of a small adTech startup, which was acquired in 2018.",
          "Automated the backend for a dynamic ad creation product, which generated revenue for over 5 years with no maintenance.",
          "Architected the PHP backend platform, automated reporting, and configured data pipelines and data storage for our products using AWS cloud services.",
          "Assisted with bigger picture technical decisions and took the initiative to perform the duties of data engineer, lead software developer, systems administrator, database administrator, and cloud systems architect.",
        ],
      },
      {
        company: "Cisco Systems",
        position: "Software Engineer III",
        location: "San Francisco, CA",
        startDate: "January 2010",
        endDate: "June 2011",
        accomplishments: [
          "Optimized front-end code, which significantly reduced download times and improved browser compatibility for an enterprise-level media platform.",
          "Influenced the internationalization (i18n) effort and worked with senior developers to implement custom text replacement in the Cisco Media Solutions Group.",
        ],
      },
      {
        company: "Foodbuzz, Inc",
        position: "Front-end Web Developer",
        location: "San Francisco, CA",
        startDate: "September 2008",
        endDate: "August 2009",
        accomplishments: [
          "Established the front-end web development framework for a small startup and initiated team coding standards.",
        ],
      },
      {
        company: "Wine Institute",
        position: "Information Technology Manager",
        location: "San Francisco, CA",
        startDate: "June 2005",
        endDate: "September 2008",
        accomplishments: [
          "Continuously improved non-profit’s IT infrastructure with a minimal budget.",
          "Migrated the main member database, rebranded and reorganized the website, and managed the network, asset management, security, and documentation.",
        ],
      },
      {
        company: "Progressive Insurance",
        position: "Telecom Specialist II",
        location: "Cleveland, OH",
        startDate: "June 2003",
        endDate: "March 2005",
        accomplishments: [
          "Provided Tier 2 network support for all United States remote offices, including daily interaction with phone carriers such as AT&T and MCI Worldcom.",
        ],
      },
      {
        company: "NCR",
        position: "Project Assistant (Intern)",
        location: "Dayton, OH",
        startDate: "June 2002",
        endDate: "August 2002",
        accomplishments: [
          "Developed and managed projects involving the deployment of a remote access Internet Virtual Private Network (IVPN) solution for the company’s remote workers.",
        ],
      },
      {
        company: "BAE Systems",
        position: "Web Developer (Intern)",
        location: "Alexandria, VA",
        startDate: "June 2000",
        endDate: "August 2001",
        accomplishments: [
          "Collaborated corporate web team to deliver ColdFusion web applications for the U.S. Navy (AEGIS), Defense Energy Support Center (DESC), and corporate inter/intranet.",
        ],
      },
    ],
    skills: [
      {
        title: "Programming",
        list: ["Python", "SQL", "JavaScript", "Ruby", "PHP", "HTML", "CSS"],
      },
      {
        title: "Machine Learning",
        list: [
          "Deep Learning",
          "Keras",
          "neural networks",
          "NLP",
          "NLTK",
          "PyTorch",
          "scikit-learn",
          "spaCy",
          "statsmodels",
          "TensorFlow",
          "unsupervised and supervised modeling",
        ],
      },
      {
        title: "Database & Data Storage",
        list: [
          "Relational",
          "NoSQL",
          "MySQL",
          "Postgres",
          "MongoDB",
          "Hadoop",
          "S3",
          "RDS",
          "Google Cloud Storage (GCS)",
        ],
      },
      {
        title: "Cloud Services",
        list: ["Amazon Web Services (AWS)", "Google Cloud Platform (GCP)"],
      },
      {
        title: "DevOps",
        list: [
          "Docker",
          "CircleCI",
          "Github",
          "Github Actions",
          "Gitlab",
          "Heroku",
          "TravisCI",
        ],
      },
      {
        title: "Tools",
        list: [
          "Anaconda",
          "bash",
          "git",
          "Github",
          "Gitlab",
          "Jira",
          "Linux server",
          "NumPy",
          "pandas",
          "scipy",
          "UNIX",
          "Vim",
          "VS Code",
          "Jupyter",
          "Spark",
          "PySpark",
          "BigQuery",
        ],
      },
      {
        title: "Data Visualization & Deployment",
        list: ["Tableau", "Seaborn", "Matplotlib", "Streamlit"],
      },
      {
        title: "Research & Analysis",
        list: [
          "A/B Testing",
          "Data Visualization",
          "Exploratory Data Analysis (EDA)",
          "Extract Transform Load (ETL)",
          "Hypothesis Testing",
          "Data Mining",
          "Data Management",
        ],
      },
    ],
    supplemental: {
      certifications: [
        {
          name: "Data Engineering, Big Data, and Machine Learning on GCP Specialization (5-Courses)",
          details:
            "https://www.coursera.org/account/accomplishments/specialization/77F6S8V7QERX",
        },
        {
          name: "Professional Scrum Master I",
          details: "https://www.scrum.org/user/364605",
        },
      ],
      projects: [
        {
          name: "Brewery Review Analysis with Natural Language Processing (NLP) and Named Entity Recognition (NER)",
          description: "Springboard Data Science Career Track Capstone Project",
          url: "https://chrisjm.co/brewery-nlp",
        },
        {
          name: "Credit Card Fraud Analysis and Prediction",
          description: "Springboard Data Science Career Track Capstone Project",
          url: "https://chrisjm.co/cc-fraud-analysis",
        },
        {
          name: "Data Science Mini-Projects",
          description:
            "Projects completed during the Springboard Data Science Career Track curriculum",
          url: "https://chrisjm.co/sb-projects",
        },
        {
          name: "Open Brewery DB",
          description: "Open source dataset and API of breweries.",
          url: "https://www.openbrewerydb.org/",
        },
      ],
      publications: [
        {
          title: "TextMate How-to",
          publisher: "Packt Publishing",
          date: "October 26, 2012",
          isbn: "1849693986",
        },
      ],
    },
  }
</script>

<Section sectionClasses="container mx-auto max-w-4xl">
  <h1 class="text-5xl text-center">{resume.personal.name}</h1>

  <div
    class="text-center mt-10 border-8 rounded p-8 mt-10 border-sky-500 bg-sky-700 text-white border-radius rounded-lg"
  >
    <div class="flex justify-center">
      <div>
        <img
          class="w-48 h-48 rounded-full shadow-lg border-4 border-white"
          src="https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1543031975/chrisjmears.com/chris-mears-profile-2018.jpg"
          alt="Chris J Mears"
        />
      </div>
    </div>
    <h2 class="text-2xl">{resume.personal.objective}</h2>
    <div class="text-center mt-6">
      <a
        href="/contact"
        class="js-event-track bg-sky-900 border-2 border-white hover:bg-sky-500 text-white font-semibold py-2 px-3 rounded shadow-md hover:shadow-none inline-block no-underline text-xl"
      >
        Let's Chat!
      </a>
    </div>
  </div>

  <div class="skills mt-10">
    <h2 class="text-2xl">Technical Skills</h2>
    <div class="tools mt-3">
      <ul class="list-disc pl-6">
        {#each resume.skills as skill}
          <li class="mb-1">
            <em>{skill.title}</em> ‒ {skill.list.join(", ")}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="personal-experience mt-10">
    <h2 class="text-2xl">Experience</h2>
    {#each resume.experience as experience}
      <div class="experience mt-4">
        <h3 class="text-xl font-bold">{experience.position}</h3>
        <div class="location-date mt-1">
          {experience.company} ‒ {experience.location} (
          {experience.startDate} to {experience.endDate})
        </div>
        <ul class="accomplishments-list list-disc pl-6 mt-1">
          {#each experience.accomplishments as accomplishment}
            <li class="accomplishment mb-1">{accomplishment}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="education mt-10">
    <h2 class="text-2xl">Education</h2>
    <ul class="education-list">
      {#each resume.education as education}
        <li class="education-item mt-3">
          <div class="degree font-bold">{education.degree}</div>
          <div>
            {education.school}, {education.location}
          </div>
          <div class="description text-sm pl-6 mt-1">
            {education.description}
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <div class="projects mt-10">
    <h2 class="text-2xl">Projects</h2>
    <ul class="projects-list">
      {#each resume.supplemental.projects as project}
        <li class="project-item mt-3">
          <h3 class="font-bold mb-1">
            <a target="_blank" href={project.url}>{project.name}</a>
          </h3>
          <p class="mt-3">{project.description}</p>
        </li>
      {/each}
    </ul>
  </div>

  <div class="certification mt-10">
    <h2 class="text-2xl">Certifications</h2>
    <ul class="certificaton-list mt-3">
      {#each resume.supplemental.certifications as certification}
        <li class="certification-item mb-1">
          <a target="_blank" href={certification.details}>
            {certification.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="publication mt-10">
    <h2 class="text-2xl">Publications</h2>
    <ul class="certificaton-list mt-3">
      {#each resume.supplemental.publications as publication}
        <li class="publication-item mb-1">
          <a
            target="_blank"
            href={`https://duckduckgo.com/?q=isbn+${publication.isbn}`}
          >
            {publication.title}
          </a>
          ({publication.publisher}; {publication.date}; ISBN: ISBN:
          <a
            target="_blank"
            href={`https://duckduckgo.com/?q=isbn+${publication.isbn}`}
          >
            {publication.isbn}
          </a>
          )
        </li>
      {/each}
    </ul>
  </div>
  <div class="interests mt-10">
    <h2 class="text-2xl">Interests</h2>
    <ul class="interests-list mt-3">
      {#each resume.personal.interests as interest}
        <li class="interest-item mb-1">{interest}</li>
      {/each}
    </ul>
  </div>
</Section>
<NewsletterSignup />
