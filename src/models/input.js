import Character from "./character";

export default class InputParser {

    static Parse(data) {

        // Each line in the data can be either a character, an empty line or a series.
        // If the line is in the series format, we save the series name and continue.
        // If the line is in the empty format, we ignore it and continue.
        // Otherwise, we assume it is a character and process it.
        // If there's an error while parsing the character, we log it, ignore the character and continue.

        // Note: if there's a character before the first series, we throw an error since it's probably a user mistake.

        let currentSeriesName = "";
        const characters = [];

        const lines = data.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (this.IsEmptyLine(line)) {
                console.log('[Parser]: Skipping empty line');
                continue;
            } else {
                const seriesParseResult = this.ParseSeriesName(line);
                if (seriesParseResult.match) {
                    // New series
                    currentSeriesName = seriesParseResult.name;
                } else {
                    // If currentSeries is empty, skip the character.
                    if (currentSeriesName.length === 0) {
                        console.log('[Parser]: Skipping character before first series: ', line, currentSeriesName);
                        continue;
                    }
                    // Try to parse a character, log and skip it if it fails to parse.
                    try {

                        const character = this.ParseCharacter(line, currentSeriesName);
                        characters.push(character);
                        console.log('[Parser]: Added character: ', line, currentSeriesName);


                    } catch (e) {
                        console.log('[Parser]: Error parsing character line: ', line, currentSeriesName);
                        console.error(e);
                    }
                }
            }
        }
        return characters;
    }

    static ParseCharacter(line, currentSeries) {
        // If it has kakera value, it's a character.
        // If it has a key, it's a character.
        // If it has none of the above, we assume the whole line is the character name and no flags were set.

        const regex = /^(?:([\w \(\)\.\,\-\']+) (\d+) ka|([\w \(\)\.\,\-\']+))(?: · :\w+key: \((\d+)\))?(?: (\d+) ka)?(?: - ([\w\.\/\:\-\~]+))?$/;


        const match = regex.exec(line);

        if (match.length === 0) return false;

        const name = match[1] || match[3];
        const kakera = match[2] || match[5] || 0;
        const keys = match[4] || 0;
        const image = match[6] || "";

        const c = new Character(null, name, currentSeries);
        c.kakeraValue = parseInt(kakera);
        c.keysAmount = parseInt(keys);
        c.mudaeName = name;
        c.mudaeImage = image.startsWith("https://mudae.net") ? '' : image; // mudae.net images are not publically accessible.

        return c;

    }

    static IsEmptyLine(line) {
        return line.trim().length === 0;
    }

    static ParseSeriesName(line) {
        const regex = /(.*) - (\d+)\/\d+/;
        const match = regex.exec(line);
        if (match) {
            return {
                match: true,
                name: match[1],
                number: match[2],
            };
        } else {
            return { match: false }
        }
    }
}