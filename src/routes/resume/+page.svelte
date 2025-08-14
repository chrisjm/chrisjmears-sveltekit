<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"
  let { data }: { data: PageData } = $props()

  // Format ISO dates (YYYY-MM-DD) to "Month D, YYYY" and handle "Present"
  const formatDate = (value: string): string => {
    if (!value) return ""
    const lower = value.toLowerCase?.()
    if (lower === "present") return "Present"
    // Parse as UTC to avoid TZ off-by-one issues for date-only strings
    const parts = value.split("-")
    const y = Number(parts[0])
    const m = Number(parts[1] || 1)
    const d = Number(parts[2] || 1)
    if (!Number.isNaN(y)) {
      const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1))
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    }
    // Fallback
    const fallback = new Date(value)
    if (!Number.isNaN(fallback.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(fallback)
    }
    return value
  }
</script>

<SEO
  title="Resume - Chris J Mears"
  description="Professional resume and work experience of Chris J Mears - Full Stack Developer with expertise in JavaScript, TypeScript, React, and Node.js"
  keywords="resume, work experience, full stack developer, javascript, typescript, react, node.js"
  type="profile"
/>

<Section sectionClasses="container mx-auto max-w-4xl">
  <h1 class="text-5xl text-center">{data.resume.basics.name}</h1>

  <div
    class="text-center mt-10 border-8 p-8 border-sky-500 bg-sky-700 text-white rounded-lg"
  >
    <div class="flex justify-center">
      <div class="mb-8">
        <img
          class="w-48 h-48 rounded-full shadow-lg border-4 border-white"
          src="https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1754953399/chris-mears-aug-2024_ncnshm.jpg"
          alt="Chris J Mears"
        />
      </div>
    </div>
    <h2 class="text-2xl">{data.resume.basics.summary}</h2>
    <div class="text-center mt-6">
      <a
        href="/contact"
        class="bg-sky-900 border-2 border-white hover:bg-sky-500 text-white font-semibold py-2 px-3 rounded shadow-md hover:shadow-none inline-block no-underline text-xl"
      >
        Let's Work Together!
      </a>
    </div>
  </div>

  <div class="skills mt-10">
    <h2 class="text-2xl">Technical Skills</h2>
    <div class="tools mt-3">
      <ul class="list-disc pl-6">
        {#each data.resume.skills as skill}
          <li class="mb-1">
            <em>{skill.name}</em> ‒ {skill.keywords.join(", ")}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="personal-experience mt-10">
    <h2 class="text-2xl">Experience</h2>
    {#each data.resume.work as experience}
      <div class="experience mt-4">
        <h3 class="text-xl font-bold">{experience.position}</h3>
        <div class="location-date mt-1">
          {experience.name}
          ({formatDate(experience.startDate)} to {experience.endDate
            ? formatDate(experience.endDate)
            : "Present"})
        </div>
        <ul class="accomplishments-list list-disc pl-6 mt-1">
          {#each experience.highlights as accomplishment}
            <li class="accomplishment mb-1">{accomplishment}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="education mt-10">
    <h2 class="text-2xl">Education</h2>
    <ul class="education-list">
      {#each data.resume.education as education}
        <li class="education-item mt-3">
          <div class="degree font-bold">{education.studyType}</div>
          <div>
            {education.institution}
          </div>
          <div class="description text-sm pl-6 mt-1">
            {education.area}
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <div class="projects mt-10">
    <h2 class="text-2xl">Projects</h2>
    <ul class="projects-list">
      {#each data.resume.projects as project}
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
    <h2 class="text-2xl">Certificates</h2>
    <ul class="certificaton-list mt-3">
      {#each data.resume.certificates as certification}
        <li class="certification-item mb-1">
          <a target="_blank" href={certification.url}>
            {certification.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="publication mt-10">
    <h2 class="text-2xl">Publications</h2>
    <ul class="certificaton-list mt-3">
      {#each data.resume.publications as publication}
        <li class="publication-item mb-1">
          {publication.name}<br />
          {publication.publisher}<br />
          {publication.releaseDate}<br />
          {publication.summary}
        </li>
      {/each}
    </ul>
  </div>
</Section>
