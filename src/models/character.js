import { GraphQLClient, gql } from "graphql-request";
import Utils from "./utils";
import { v4 as uuidv4 } from "uuid";

export default class Character {
  constructor(
    uuid,
    name,
    series,
    canonicalName = "",
    canonicalSeries = "",
    image = "",
    birthday = 1,
    birthmonth = 1,
    age = 1,
    description = "",
    favourites = 0,
    siteUrl = "",
    gender = "",
    seriesImage = "",
    id = 0,
    alternative = [],
    tier = "",
    kakeraValue = 0,
    keysAmount = 0,
    mudaeName = "",
    mudaeImage = ""
  ) {
    // if (name.length > 0) {
    //   console.trace("New Character: ", name);
    // }
    if(uuid == null) {
      this.uuid = uuidv4();
    } else {
      this.uuid = uuid;
    }
    this.name = Utils.CharacterSpellCheck(name);
    this.series = Utils.SeriesSpellCheck(series);
    this.canonicalName = canonicalName;
    this.canonicalSeries = canonicalSeries;
    this.image = image;
    this.birthday = birthday;
    this.birthmonth = birthmonth;
    this.age = age;
    this.description = description;
    this.favourites = favourites;
    this.siteUrl = siteUrl;
    this.gender = gender;
    this.seriesImage = seriesImage;
    this.id = id;
    this.alternative = alternative;
    this.tier = tier;
    this.kakeraValue = kakeraValue;
    this.keysAmount = keysAmount;
    this.mudaeName = mudaeName;
    this.mudaeImage = mudaeImage;
    this.status = "parsed";
  }

  /// Returns whether the input series title is the same as the saved one.
  /// Input series title must be an object with a 'romaji' property and an optional 'english' property.
  CompareSeriesName(series_title) {
    const romaji = Utils.SanitizeSpecialCharacters(
      series_title.romaji,
      "☆‘",
      " '"
    );
    const sanitized = Utils.SanitizeSpecialCharacters(this.series, "☆‘", " '");

    const romajiMatch =
      romaji.toLowerCase().includes(sanitized.toLowerCase()) ||
      sanitized.toLowerCase().includes(romaji.toLowerCase());

    let englishMatch = false;
    if (series_title.english != null) {
      const english = Utils.SanitizeSpecialCharacters(
        series_title.english,
        "☆‘",
        " '"
      );

      englishMatch =
        english.toLowerCase().includes(sanitized.toLowerCase()) ||
        sanitized.toLowerCase().includes(english.toLowerCase());
    }

    return romajiMatch || englishMatch;
  }

  /// Checks whether a saved character corresponds to the input first and last names
  CheckByNames(names) {

      const currentName = this.GetSanitizedName();
    
      const nameWithoutParenthesis = currentName.split("(")[0].trim();


      const names_first = names.first || "";
      const names_last = names.last || "";
      const names_full = names.full || "";

      console.log('[CheckByNames]: ', names_full, nameWithoutParenthesis);

      let alternativeChecks = false;
      for (let i = 0; i < names.alternative.length; i ++ ) {
        if (this.name == names.alternative[i]) {
          alternativeChecks = true;
          break;
        }
      }

      const result = (
        alternativeChecks ||
        this.name === `${names_first.trim()} ${names_last.trim()}` ||
        this.name === `${names_last.trim()} ${names_first.trim()}` ||
        this.name === names_first.trim() ||
        this.name === names_last.trim() ||
        this.name === names_full.trim() ||
        nameWithoutParenthesis === `${names_first.trim()} ${names_last.trim()}` ||
        nameWithoutParenthesis === `${names_last.trim()} ${names_first.trim()}` ||
        nameWithoutParenthesis === names_first.trim() ||
        nameWithoutParenthesis === names_last.trim() ||
        nameWithoutParenthesis === names_full.trim()
      );

      console.log('[CheckByNames]: Result => ', result);

      return result;
  }

  GetSanitizedName(withoutParenthesis = true) {
    const charactersToReplace = "áéíóúñãõåàèìòùâêîôûäëïöü";
    const replacements = "aeiounaoaaeiouaeiouaeiou";

    const sanitized = Utils.SanitizeSpecialCharacters(
      this.GetNameWithoutHonorifics(),
      charactersToReplace,
      replacements
    );

    if (withoutParenthesis) {
      return sanitized.split("(")[0].trim();
    }
  }

  /// Fetches data from sanitized character name
  async FetchData(client = null) {
    if (client == null) {
      client = new GraphQLClient("https://graphql.anilist.co");
    }
    // Get series data from anilist.co GraphQL API
    const query = Character.GQL_QUERY_FETCH_CHARACTER;

    const variables = {
      charName: this.GetSanitizedName(),
    };

    try {
      const data = await client.request(query, variables);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  GetNameWithoutHonorifics() {
    let name = Utils.CharacterSpellCheck(
      this.canonicalName.length > 0 ? this.canonicalName : this.name // Use canonical if possible.
    );
    const honorifics = [
      "-san",
      "-chan",
      "-dono",
      "-sama",
      "-neesan",
      "-niisan",
      "-niichan",
      "-kun",
      "-tan",
    ];

    honorifics.forEach((honorific) => {
      name = name.replace(honorific, "");
    });
    return name;
  }

  /// Fetches character data from a list of characters from ANILIST.CO
  async FetchDataSearch(client = null) {
    if (client == null) {
      client = new GraphQLClient("https://graphql.anilist.co");
    }
    const query = Character.GQL_QUERY_SEARCH_CHARACTER;

    const variables = {
      charName: this.GetSanitizedName(),
      page: 1,
    };

    try {
      const data = await client.request(query, variables);
      let char_data = null;
      if (data.Page.characters.length > 0) {
        for (let i = 0; i < data.Page.characters.length; i++) {
          const char = data.Page.characters[i];
          // Check if series name matches
          let series_match = false;
          char.media.edges.forEach((edge) => {
            if (this.CompareSeriesName(edge.node.title)) {
              series_match = true;
            }
          });
          if (series_match) {
            char_data = char;
            break; // End for loop.
          }
        }
      }
      return char_data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  SetImage(src) {
    this.image = src;
  }

  FillFromFetched(data) {
    console.log(`[${this.name}]::FillFromFetched`, data);
    this.canonicalName = data.name.full;
    if (data.media) {
      this.canonicalSeries = Character.GetDefaultEdge(
        data.media.edges
      ).node.title.romaji;
      this.seriesImage = Character.GetDefaultEdge(
        data.media.edges
      ).node.bannerImage;
    }
    
    this.image = data.image.large;
    this.birthday = data.dateOfBirth.day;
    this.birthmonth = data.dateOfBirth.month;
    this.age = data.age;
    this.description = data.description;
    this.favourites = data.favourites;
    this.siteUrl = data.siteUrl;
    this.gender = data.gender;
    this.id = data.id;
    this.alternative = data.name.alternative;
  }

  toJson() {
    return {
      uuid: this.uuid,
      name: this.name,
      canonicalName: this.canonicalName,
      canonicalSeries: this.canonicalSeries,
      series: this.series,
      image: this.image,
      birthday: this.birthday,
      birthmonth: this.birthmonth,
      age: this.age,
      description: this.description,
      favourites: this.favourites,
      siteUrl: this.siteUrl,
      gender: this.gender,
      seriesImage: this.seriesImage,
      id: this.id,
      alternative: this.alternative,
      tier: this.tier,
      kakeraValue: this.kakeraValue,
      keysAmount: this.keysAmount,
      mudaeName: this.mudaeName,
      mudaeImage: this.mudaeImage,
    };
  }

  FromJson(data) {
    this.uuid = data.uuid;
    this.name = data.name;
    this.canonicalName = data.canonicalName;
    this.canonicalSeries = data.canonicalSeries;
    this.series = data.series;
    this.image = data.image;
    this.birthday = data.birthday;
    this.birthmonth = data.birthmonth;
    this.age = data.age;
    this.description = data.description;
    this.favourites = data.favourites;
    this.siteUrl = data.siteUrl;
    this.gender = data.gender;
    this.seriesImage = data.seriesImage;
    this.id = data.id;
    this.alternative = data.alternative;
    this.tier = data.tier;
    this.kakeraValue = data.kakeraValue;
    this.keysAmount = data.keysAmount;
    this.mudaeName = data.mudaeName;
    this.mudaeImage = data.mudaeImage;
  }

  static FromJson(data) {
    return new Character(
      data.uuid,
      data.name,
      data.series,
      data.canonicalName,
      data.canonicalSeries,
      data.image,
      data.birthday,
      data.birthmonth,
      data.age,
      data.description,
      data.favourites,
      data.siteUrl,
      data.gender,
      data.seriesImage,
      data.id,
      data.alternative,
      data.tier,
      data.kakeraValue,
      data.keysAmount,
      data.mudaeName,
      data.mudaeImage
    );
  }

  // Returns the oldest title in edges, based on startDate.year
  static GetDefaultEdge(edges) {
    let min_year = 99999;
    let min_edge = null;
    edges.forEach((edge) => {
      if (edge.node.startDate.year) {
        if (edge.node.startDate.year < min_year) {
          min_year = edge.node.startDate.year;
          min_edge = edge;
        } else if (edge.node.startDate.year == min_year) {
          if (edge.node.popularity > min_edge.node.popularity) {
            min_edge = edge; // In case of same year releases, pick the one with the highest popularity
          }
        }
      }
    });
    return min_edge;
  }

  SetTier(tier) {
    if (["S", "A", "B", "C", "D", "F"].includes(tier.toUpperCase())) {
      this.tier = tier.toUpperCase();
    } else {
      throw new Error("Invalid tier: " + tier);
    }
    return this.tier;
  }
  ClearTier() {
    this.tier = "";
  }

  static GQL_QUERY_FETCH_CHARACTER = gql`
    query ($charName: String) {
      Character(search: $charName) {
        name {
          full
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
  `;

  static GQL_QUERY_SEARCH_CHARACTER = gql`
    query ($charName: String, $page: Int) {
      Page(page: $page) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        characters(search: $charName) {
          name {
            full
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
}
