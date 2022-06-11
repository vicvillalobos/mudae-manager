import { GraphQLClient, gql } from "graphql-request";
import Utils from "./utils";

export default class AnilistLoader {
    // this class should be responsible for loading the data from the Anilist API and calling
    // the update function on the characters in the store.

    static async SearchCharactersBySeriesName(characters, series) {
        console.log('[Fetch]: Searching for characters in series: ', series.name);
        const client = new GraphQLClient("https://graphql.anilist.co");

        let page = 1;
        let nextPage = true;
        let notFoundCharacters = characters.filter(character => character.series === series.name);
        notFoundCharacters = notFoundCharacters.map(character => {
            character.status = "fetching";
            return character;
        });

        while (nextPage && notFoundCharacters.length > 0) {
            const data = await this.GetPageData(client, series.name, page, this.SERIES_SEARCH_QUERY);

            if (data != null) {
                
                console.log('[Fetch]: Found characters: ', data.Media.characters.nodes.map(character => character.name.full));

                for(let i = 0; i < data.Media.characters.nodes.length; i++) {
                    const node = data.Media.characters.nodes[i];

                    // Check if sanitized series name somewhat matches with the fetched one
                    const seriesMatch = notFoundCharacters.find(character => {

                        for (let i = 0; i < node.media.edges.length; i++) {
                            const seriesNode = node.media.edges[i].node;
                            
                            if (character.CompareSeriesName(seriesNode.title)) {
                                return true;
                            }
                        }

                        return false;
                    });

                    // Then check if the sanitized character names match with the fetched one
                    if (!seriesMatch) continue;

                    const characterMatch = notFoundCharacters.find(character => {
                        return character.CheckByNames(node.name);
                    });

                    if (characterMatch) {
                        characterMatch.FillFromFetched(node);
                        characterMatch.status = "found";
                        notFoundCharacters = notFoundCharacters.filter(character => character.uuid !== characterMatch.uuid);
                        console.log('[Fetch]: Found character: ', characterMatch.name);
                        // break;
                    }

                }
                

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
        if (notFoundCharacters.length > 0) {

            notFoundCharacters = notFoundCharacters.map(character => {
                character.status = "notinseries";
                return character;
            });
            // We cant do much else without making a mistake.
            // Since some characters have wrong series names from mudae.
            // Example: Characters from Monogatari series show 'monogatari' instead of the actual series name.
            
            // Fetch character data from name. May return something wrong but it's the best we can do.
            console.log('[Fetch]: Characters not found in series: ', notFoundCharacters.map(character => character.name));
            console.log('[Fetch]: Fetching character data from name.');
            for (let i = 0; i < notFoundCharacters.length; i++) {
                await this.SearchCharactersByCharacterName(notFoundCharacters[i]);
            }

            // Maybe we can search by name and then ask the user to select the correct one? Might be annoying though.
        }

        return notFoundCharacters <= 0;
    }

    static async GetPageData(client, search, page, query) {
        // Get series data from anilist.co GraphQL API

        const variables = {
            page: page,
            searchQuery: search,
        };

        try {
            const data = await client.request(query, variables);
            return data;
        } catch (e) {
            if (e.response.status === 404) {
                console.log('[Fetch]: 404 error, skipping .');
            } else {
                console.error(e);
            }
            return null;
        }
    }

    static async SearchCharactersByCharacterName(character) {
        const client = new GraphQLClient("https://graphql.anilist.co");
        const PAGE_LIMIT = 1000;

        character.status = "fetchingbyname";

        let nextPage = true;
        let page = 1;
        let foundCharacters = [];
        
        while (nextPage && page < PAGE_LIMIT) {
            const data = await this.GetPageData(client, character.GetSanitizedName(), page, this.GQL_QUERY_SEARCH_CHARACTER);

            if (data != null) {
             
                for(let i = 0; i < data.Page.characters.length; i++) {

                    const characterLookup = data.Page.characters[i];

                    foundCharacters.push(characterLookup.name.full);

                    if(character.CheckByNames(characterLookup.name)) {
                        character.FillFromFetched(characterLookup);
                        character.status = "found";
                        return true;
                    }
                }

                if (data.Page.pageInfo.hasNextPage) {
                    page ++;
                } else {
                    nextPage = false;
                }   
            } else {
                // Probably a network or server error. Skip character.
                nextPage = false;
            }

            // Wait for .7 seconds to avoid hitting the API rate limit
            await Utils.WaitForSeconds(0.7);
        }
        console.log('[Fetch]: Character [', character.name, '] not found.');
        console.log('[Fetch]: Found characters: ', foundCharacters);
        character.status = "notfound";
        return false;
    }

    static GQL_QUERY_SEARCH_CHARACTER = gql`
    query ($searchQuery: String, $page: Int) {
      Page(page: $page) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        characters(search: $searchQuery) {
          name {
            full
            first
            last
            alternative
          }
          image {
            large
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
          dateOfBirth {
            year
            month
            day
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
  `;

    static SERIES_SEARCH_QUERY = gql`
    query ($searchQuery: String, $page: Int) {
      Media(search: $searchQuery, type: ANIME) {
        characters(page: $page) {
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