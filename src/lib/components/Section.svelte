<script>
  export let sectionClasses = "bg-white text-black"
  export let containerClasses = "container mx-auto p-8 md:p-16"
</script>

<section class={sectionClasses}>
  <div class={containerClasses}><slot /></div>
</section>
