<script>
  import Section from "$lib/components/Section.svelte"
</script>

<Section sectionClasses="bg-sky-700 text-white hero relative overflow-hidden">
  <div
    class="absolute inset-0 opacity-[0.07] pointer-events-none"
    aria-hidden="true"
    style="background-image: linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 32px 32px;"
  ></div>
  <div class="flex flex-col md:flex-row items-center relative">
    <div class="mb-5 md:mb-0 md:mr-10 hero-photo">
      <img
        class="w-48 h-48 rounded-full shadow-lg mb-0 ring-4 ring-white/20"
        src="https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1754953399/chris-mears-aug-2024_ncnshm.jpg"
        alt="Chris J Mears"
      />
    </div>
    <div class="flex-1 antialiased">
      <h1 class="text-5xl font-display font-bold mb-2 hero-headline">Hi! My name is Chris.</h1>
      <h2 class="text-2xl font-bold text-sky-200 mb-6 hero-subtitle">
        I'm an aspiring
        <strong class="text-white">Machine Learning Engineer</strong>
        specializing in
        <strong class="text-white">Analytics Engineering</strong>,
        with expertise in
        <strong class="text-white">
          Software Engineering, Data Visualization, and Healthcare Analysis
        </strong>.
      </h2>
      <div class="hero-cta">
        <a href="/contact" class="btn">Let's Work Together!</a>
      </div>
    </div>
  </div>
</Section>

<style>
  .hero-photo {
    animation: fadeSlideIn 0.5s ease-out both;
    animation-delay: 0.1s;
  }
  .hero-headline {
    animation: fadeSlideIn 0.5s ease-out both;
    animation-delay: 0.25s;
  }
  .hero-subtitle {
    animation: fadeSlideIn 0.5s ease-out both;
    animation-delay: 0.4s;
  }
  .hero-cta {
    animation: fadeSlideIn 0.5s ease-out both;
    animation-delay: 0.55s;
  }
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
