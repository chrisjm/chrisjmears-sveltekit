<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"
  import { resume } from "$lib/resume"
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
          {experience.company} - {experience.location} (
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
