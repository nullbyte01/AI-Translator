<script lang="ts">
  import { onMount } from "svelte";
  import { GetResponse } from "../utils/AIService";
  import type { ILanguageTranslator } from "../utils/TranslationHelper";

  export let translationLanguages: string[] | undefined;
  const AUTODETECT: string = "AutoDetect";
  let translationFrom: string[] = [];
  let translationTo: string[] = [];
  let defaultTranslationFrom: string = "";
  let defaultTranslationTo: string = "";
  let textToTranslate: string = "";
  let textTranslationResult: string = "";
  let translationResponse: ILanguageTranslator;
  let isLoading: boolean = false;

  onMount(() => {
    if (translationLanguages && translationLanguages.length > 0) {
      translationFrom = [...translationLanguages];
      translationTo = [...translationLanguages];

      if (translationFrom && !translationFrom.includes(AUTODETECT)) {
        translationFrom.unshift(AUTODETECT);
        defaultTranslationFrom = AUTODETECT;
      }
      defaultTranslationTo = translationTo.find((lang) =>
        lang.includes("English")
      )!;
    }
  });

  let getTranslation = async (): Promise<ILanguageTranslator | undefined> => {
    let prompt =
      defaultTranslationFrom === AUTODETECT
        ? `Just detect this language and translate the following text: ${textToTranslate} to ${defaultTranslationTo}. Return result in json, do not return anything apart from it not event formatting, with schema {detectedLanguage:"",translatedText:""}`
        : `Just translate from ${defaultTranslationFrom} the following text: ${textToTranslate} to ${defaultTranslationTo}. Return result in json, do not return anything apart from it not event formatting, with schema {detectedLanguage:"",translatedText:""}`;

    var response = await GetResponse(prompt);
    var jsonResult = JSON.parse(response);
    if (
      jsonResult &&
      jsonResult.detectedLanguage &&
      jsonResult.translatedText
    ) {
      translationResponse = {
        detectedLanguage: jsonResult.detectedLanguage,
        translatedText: jsonResult.translatedText,
      };
      return translationResponse;
    }
    return undefined;
  };

  let onTranslateClicked = async () => {
    if (textToTranslate.length == 0) {
      alert("Seems like there was nothing detected to translate");
      return;
    }

    if (translationFrom === translationTo) {
      alert("Seems like you have selected the same language to translate to");
      return;
    }

    isLoading = true;
    var result = await getTranslation();
    if (result && result.detectedLanguage && result.translatedText) {
      defaultTranslationFrom = result.detectedLanguage;
      textTranslationResult = result.translatedText;
      isLoading = false;
    } else {
      alert("Seems like there was some problem while translating");
      isLoading = false;
      return;
    }
  };
</script>

<div class="flex flex-col md:flex-row justify-between w-full items-start md:items-center">
  <div class="flex flex-col w-full md:w-[45%] mb-4 md:mb-0">
    <label for="from-language">Translate from:</label>
    <select
      class="mb-2 p-2 text-sm rounded border border-gray-300"
      name="from-language"
      bind:value={defaultTranslationFrom}
    >
      {#if translationFrom}
        {#each translationFrom as language}
          <option value={language}>{language}</option>
        {/each}
      {/if}
    </select>
    <div class="w-full h-auto p-1 border-2 border-gray-300 rounded-lg box-border bg-white">
      <textarea
        class="w-full h-[30vh] border-0 resize-none outline-none p-1 rounded-lg box-border text-base"
        rows="4"
        cols="50"
        maxlength="512"
        bind:value={textToTranslate}
      />
    </div>
  </div>

  <div class="flex items-center justify-center md:p-5 mb-4 md:mb-0 w-full md:w-auto">
    <button
      class="px-5 py-2.5 text-base rounded border-0 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 mx-auto"
      on:click={onTranslateClicked}
    >
      Translate
    </button>
  </div>

  <div class="flex flex-col w-full md:w-[45%]">
    <label for="to-language">Translate to:</label>
    <select
      class="mb-2 p-2 text-sm rounded border border-gray-300"
      name="to-language"
      bind:value={defaultTranslationTo}
    >
      {#if translationTo}
        {#each translationTo as language}
          <option value={language}>{language}</option>
        {/each}
      {/if}
    </select>
    <div class="w-full h-auto p-1 border-2 border-gray-300 rounded-lg box-border bg-white">
      <textarea
        class="w-full h-[30vh] border-0 resize-none outline-none p-1 rounded-lg box-border text-base"
        rows="4"
        cols="50"
        maxlength="512"
        bind:value={textTranslationResult}
      />
    </div>
  </div>
</div>

{#if isLoading}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50"
  >
    <div class="flex flex-col items-center">
      <div
        class="animate-spin h-10 w-10 border-4 border-t-transparent border-blue-500 rounded-full mr-3"
      ></div>
      <p class="font-semibold mt-4 text-white">Translating......</p>
    </div>
  </div>
{/if}
