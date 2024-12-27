<script>
  import Heading2 from "$lib/components/Heading2.svelte"
  import Section from "$lib/components/Section.svelte"
</script>

<Section>
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
        <ul class="text-lg mb-8">
          <li class="mb-4 leading-tight">
            As an accomplished Senior Software Engineer transitioning into Data Engineering, I bring a strong foundation in JavaScript and Python, complemented by my expertise in data analysis and statistics. My passion for machine learning and artificial intelligence fuels my commitment to harnessing data to drive actionable insights and innovative solutions.
          </li>
          <li class="mb-4 leading-tight">
            I own and operate a
            <a href="https://www.wanderingleafstudios.com" target="_blank">
              data analytics consulting business
            </a>
            and have previously worked for companies large and small in different
            sectors including Fortune 500, startups, and non-profits.
          </li>
          <li class="mb-4 leading-tight">
            Finally, Iʼm an open-source project maintainer,
            <a href="https://www.openbrewerydb.org/" target="_blank">
              Open Brewery DB
            </a>
            , and proud rescue dog owner.
          </li>
          <li class="mb-4 leading-tight"></li>
        </ul>
      </div>
    </div>
  </div>
</Section>
