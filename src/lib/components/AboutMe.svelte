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
            I'm Senior Software Engineer with a focus on Data Engineering, Data Analysis, Machine Learning, Artificial Intelligence, and Aviation.
          </li>
          <li class="mb-4 leading-tight">
            I'm currently employed as a Senior Engineer with
            <a href="https://www.carevoyance.com" target="_blank">
              H1 | Carevoyance
            </a>
            , a healthcare business intelligence and sales platform.
          </li>
          <li class="mb-4 leading-tight">
            I also own and operate a
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
            , and rescue dog owner.
          </li>
          <li class="mb-4 leading-tight" />
        </ul>
      </div>
    </div>
  </div>
</Section>
