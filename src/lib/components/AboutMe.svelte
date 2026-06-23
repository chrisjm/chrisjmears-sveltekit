<script>
  import Heading2 from "$lib/components/Heading2.svelte"
  import Section from "$lib/components/Section.svelte"
</script>

<Section sectionClasses="bg-slate-50">
  <Heading2 title="About Me" />
  <div class="flex flex-col lg:flex-row">
    <div class="mb-5 md:mr-5 text-center">
      <img
        class="w-48 h-48 rounded-full shadow-lg inline"
        src="https://res.cloudinary.com/wanderingleafstudios/image/upload/c_scale,w_512/v1543031462/chrisjmears.com/Cooper_and_I_in_Julian.jpg"
        alt="Me and Cooper, the tiny black dog."
      />
    </div>
    <div class="flex-1 mb-5 md:mr-5">
      <div>
        <ul class="text-lg mb-8 space-y-4">
          <li class="leading-relaxed">
            I'm a builder who spent two decades writing software, got curious about what the data actually said, and went back to school in my forties to learn the math and research principles. 
            Now I design data systems that don't fall over, from healthcare claims pipelines and LLM evaluations to analytics products. I thrive at companies that need someone to own ambiguous, end-to-end problems.
          </li>
          <li class="leading-relaxed">
            Through my consulting practice,
            <a href="https://www.wanderingleafstudios.com" target="_blank">
              Wandering Leaf Studios
            </a>
            , I help teams turn messy data into clear strategy. Having worked across Fortune 500s, startups, non-profits, and universities, I'm always chasing the same question: <em>Are we building what actually matters?</em>
          </li>
          <li class="leading-relaxed">
            Outside of work, I maintain
            <a href="https://www.openbrewerydb.org/" target="_blank">
              Open Brewery DB
            </a>
            , an open-source dataset and API I built that serves nearly 1 million weekly requests on a pocket-change budget. I'm also a student and graduate TA for Georgia Tech's Online Masters of Science in Analytics (OMSA) program and doing my best to learn in public.
          </li>
        </ul>
      </div>
    </div>
  </div>
</Section>
