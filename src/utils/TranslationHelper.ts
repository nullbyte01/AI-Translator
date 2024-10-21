export interface ILanguageTranslator {
    detectedLanguage: string;
    translatedText: string;
}

const ParseTranslationLanguages = (csvString: string): string[] | undefined => {
    try {

        if (csvString && csvString.length > 0) {
            let seperatedLanguages = csvString.split(',').map(lang => lang.trim());
            return seperatedLanguages;
        }
    } catch (error) {
        console.log('ParseTranslationLanguages Error ocurred: ' + error);
    }
    return undefined;
}

export { ParseTranslationLanguages }