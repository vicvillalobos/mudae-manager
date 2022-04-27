import Character from "./character";
import Utils from "./utils";
import { GraphQLClient, gql } from "graphql-request";

export default class Series {
  constructor(name, characters = []) {
    this.name = Utils.SeriesSpellCheck(name);
    this.characters = characters;
  }

  AddCharacter(character) {
    this.characters.push(character);
  }

  async FetchData() {
    const client = new GraphQLClient("https://graphql.anilist.co");

    let page = 1;
    let nextPage = true;
    let notFoundCharacters = this.characters.length;
    const notFoundCharactersReference = [...this.characters];
    // console.log(
    //   "starting with series characters: ",
    //   JSON.stringify(this.characters)
    // );

    const nodes = [];

    while (nextPage && notFoundCharacters > 0) {
      const data = await this.GetPageData(client, page);
      // console.log(`[${this.name}] Fetched page ${page}`);

      if (data != null) {
        // console.log(data.Media.characters);

        data.Media.characters.nodes.forEach((character) => {
          nodes.push(character);
          const charIndex = this.FindCharacterIndexByNames(
            character.name.first,
            character.name.last,
            notFoundCharactersReference
          );
          if (charIndex >= 0) {
            // Character found!
            notFoundCharacters--;
            notFoundCharactersReference[charIndex].FillFromFetched(character);
            notFoundCharactersReference.splice(charIndex, 1);
          }
        });

        if (data.Media.characters.pageInfo.hasNextPage) {
          page++;
        } else {
          nextPage = false;
        }
      } else {
        // Probably a 404 error, abort series.
        nextPage = false;
      }

      // Wait for .7 seconds to avoid hitting the API rate limit
      await Utils.WaitForSeconds(0.7);
    }
    if (notFoundCharacters > 0) {
      // console.log(
      //   `[${this.name}] Could not find ${notFoundCharacters} characters!`
      // );
      // We cant do much else without making a mistake.
      // Since some characters have wrong series names from mudae.
      // Example: Characters from Monogatari series show 'monogatari' instead of the actual series name.
      await this.FetchIndividualCharactersData(
        client,
        notFoundCharactersReference
      );
    }

    return notFoundCharacters <= 0;
  }

  // Gets all characters from the series without image and tries to fetch them individually.
  async FetchIndividualCharactersData(client, characters) {
    // console.log("fetching data for characters: ", characters);
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].canonicalName.length <= 0) {
        characters[i].canonicalName = characters[i].name.split("(")[0].trim(); // Remove series name from character name
      }

      const noLastName = characters[i].canonicalName.split(" ").length < 2;
      if (characters[i].image.length > 0) continue;

      // console.log(
      //   "fetching individual data for character: ",
      //   characters[i].name
      // );

      const char_data = await characters[i].FetchDataSearch(client);

      if (char_data != null) {
        // console.log(
        //   `[${characters[i].name}]`,
        //   "character data fetched!",
        //   char_data
        // );
        // const series_title = Character.GetDefaultEdge(char_data.media.edges)
        //   .node.title;

        let match = false;
        for (let j = 0; j < char_data.media.edges.length; j++) {
          const edge = char_data.media.edges[j];
          if (characters[i].CompareSeriesName(edge.node.title)) {
            match = true;
            break;
          }
        }

        //.SetImage(char_data.Character.image.large);
        if (noLastName && !match) {
          continue;
        }
        characters[i].FillFromFetched(char_data);
      } else {
        // console.log(
        //   `[${this.name}] Could not fetch data for character: ${characters[i].name}`
        // );
      }

      await Utils.WaitForSeconds(0.7);
    }
  }

  FindCharacterIndexByNames(name, last_name, list = null) {
    let characters_list = [...this.characters];
    if (list != null) characters_list = list;
    return characters_list.findIndex((x) => {
      const name_alt = x.name.split("(")[0].trim();
      return (
        x.name === `${name} ${last_name}` ||
        x.name === `${last_name} ${name}` ||
        x.name === name ||
        name_alt === `${name} ${last_name}` ||
        name_alt === `${last_name} ${name}` ||
        name_alt === name
      );
    });
  }

  async GetPageData(client, page = 0) {
    // Get series data from anilist.co GraphQL API
    const query = Series.GQL_QUERY_FETCH_SERIES;

    const variables = {
      pageNumber: page,
      seriesName: this.name,
    };

    try {
      const data = await client.request(query, variables);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static GetSeriesFromMMAS(mmasOutput) {
    try {
      // Format name: "Series Name - 9999/9999"
      const seriesRegex = /(.*) - (\d+)\/\d+/;

      const lines = mmasOutput.split("\n");

      let characterList = [];

      let series = "";
      const seriesList = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (seriesRegex.test(line)) {
          // New series
          series = line.match(seriesRegex)[1];
          seriesList.push(new Series(series));
        } else if (line.length > 0) {
          // New character
          const c = new Character(line, series);
          characterList.push(c);
          seriesList[seriesList.length - 1].AddCharacter(c);
        }
      }
      return seriesList;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  static GQL_QUERY_FETCH_SERIES = gql`
    query ($seriesName: String, $pageNumber: Int) {
      Media(search: $seriesName, type: ANIME) {
        characters(page: $pageNumber) {
          pageInfo {
            currentPage
            hasNextPage
          }
          nodes {
            name {
              first
              last
              full
              alternative
            }
            image {
              large
            }
            dateOfBirth {
              year
              month
              day
            }
            media {
              edges {
                node {
                  popularity
                  title {
                    romaji
                    english
                  }
                  startDate {
                    year
                  }
                  bannerImage
                }
              }
            }
            description
            age
            favourites
            siteUrl
            gender
            id
          }
        }
      }
    }
  `;
}
