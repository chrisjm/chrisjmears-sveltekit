<script>
  import Section from "$lib/components/Section.svelte"
</script>

<Section sectionClasses="bg-sky-700 text-white hero">
  <div class="flex flex-col md:flex-row items-center">
    <div class="mb-5 md:mb-0 md:mr-10">
      <img
        class="w-48 h-48 rounded-full shadow-lg mb-0"
        src="https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1754953399/chris-mears-aug-2024_ncnshm.jpg"
        alt="Chris J Mears"
      />
    </div>
    <div class="flex-1 antialiased">
      <h1 class="text-5xl font-bold mb-2">Hi! My name is Chris.</h1>
      <h2 class="text-2xl font-bold text-sky-200 mb-6">
        I'm a
        <strong class="text-white">
          Senior-level Software Engineer and aspiring Machine Learning Engineer
        </strong>
        with expertise in
        <strong class="text-white">
          Data Analysis, Data Visualization, Machine Learning, and AI
        </strong>.
      </h2>
      <a href="/contact" class="btn">Let's Work Together!</a>
    </div>
  </div>
</Section>
