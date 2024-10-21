<script lang="ts">
  import { onMount } from "svelte";
  import Translator from "./lib/Translator.svelte";
  import { LoadGemini, GetResponse } from "./utils/AIService";
  import { ParseTranslationLanguages } from "./utils/TranslationHelper";

  let langArray: string[] | undefined;

  onMount(() => {
    let isLoaded = LoadGemini();
    if (isLoaded) {
      let fetchTranslationLanguages = async () => {
        var response = await GetResponse(
          "Fetch me all the languages used for translation with comma seperated. Just return me this information and nothing else"
        );
        langArray = ParseTranslationLanguages(response);
      };
      fetchTranslationLanguages();
    }
  });
</script>

<main>
  <div class="main">
    <div class="gradient"></div>
  </div>
  <div class="container">
    <h1 class="headertext">
      Welcome to AI translation powered by <br class="max-md:hidden" />
      <span class="orange_gradient">Gemini AI</span>
    </h1>
    <h2 class="description">
      Experience AI-Powered Translation with GenAI: Effortlessly Retrieve and Translate Languages Without Relying on Third-Party APIs, All Through Advanced AI Technology.
    </h2>

    <div class="mt-8">
      {#if langArray}
        <Translator translationLanguages={langArray} />
      {:else}
        <p>loading.....</p>
      {/if}
    </div>

    <footer class="bottom-5 left-0 right-0 text-center py-4 mx-auto mt-12">
      <p class="blue_gradient">Crafted in Svelte + Typescript</p>
  </footer>
  </div>
</main>
