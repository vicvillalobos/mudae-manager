import CharacterSpellCheck from "../data/names_spellcheck.json";
import SeriesSpellCheck from "../data/series_spellcheck.json";

export default class Utils {
  static WaitForSeconds(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

  static CharacterSpellCheck(characterName) {
    for (let i = 0; i < CharacterSpellCheck.length; i++) {
      const element = CharacterSpellCheck[i];
      characterName = characterName.replace(element.mudae, element.anilist);
    }

    return characterName;
  }
  static SeriesSpellCheck(seriesName) {
    for (let i = 0; i < SeriesSpellCheck.length; i++) {
      const element = SeriesSpellCheck[i];
      seriesName = seriesName.replace(element.mudae, element.anilist);
    }

    return seriesName;
  }

  static SanitizeSpecialCharacters(text, characters, replaceWith) {
    let sanitizedText = text;
    for (let i = 0; i < characters.length; i++) {
      sanitizedText = sanitizedText.replaceAll(characters[i], replaceWith[i]);
    }
    return sanitizedText;
  }
}
