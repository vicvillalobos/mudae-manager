import { GraphQLClient, gql } from "graphql-request";
import Utils from "./utils";

export default class Character {
  constructor(
    name,
    series,
    canonicalName = "",
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
    alternative = []
  ) {
    // if (name.length > 0) {
    //   console.trace("New Character: ", name);
    // }
    this.name = name;
    this.series = Utils.SeriesSpellCheck(series);
    this.canonicalName = canonicalName;
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
  }

  // Returns true if
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

    // console.log(
    //   `[${
    //     this.name
    //   }::CompareSeriesName] romajiMatch: ${romaji.toLowerCase()} => ${sanitized.toLowerCase()}`
    // );

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

      // console.log(
      //   `[${
      //     this.name
      //   }::CompareSeriesName] englishMatch: ${english.toLowerCase()} => ${sanitized.toLowerCase()}`
      // );
    }

    // console.log(
    //   `[${this.name}::CompareSeriesName] romaji: ${romajiMatch}, english:${englishMatch}`
    // );

    return romajiMatch || englishMatch;
  }

  GetSanitizedName() {
    const charactersToReplace = "áéíóúñãõåàèìòùâêîôûäëïöü";
    const replacements = "aeiounaoaaeiouaeiouaeiou";

    return Utils.SanitizeSpecialCharacters(
      this.GetNameWithoutHonorifics(),
      charactersToReplace,
      replacements
    );
  }

  async FetchData(client = null) {
    if (client == null) {
      client = new GraphQLClient("https://graphql.anilist.co");
    }
    // Get series data from anilist.co GraphQL API
    const query = Character.GQL_QUERY_FETCH_CHARACTER;

    // console.log("fetching character:", this.GetSanitizedName());

    const variables = {
      charName: this.GetSanitizedName(),
    };

    try {
      const data = await client.request(query, variables);
      //console.log(`[${this.name}::FetchData] char data:`, data);
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
      this.series = Character.GetDefaultEdge(
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
      name: this.name,
      canonicalName: this.canonicalName,
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
    };
  }

  FromJson(data) {
    this.name = data.name;
    this.canonicalName = data.canonicalName;
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
  }

  static FromJson(data) {
    return new Character(
      data.name,
      data.series,
      data.canonicalName,
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
      data.alternative
    );
  }

  // Returns the oldest title in edges, based on startDate.year
  static GetDefaultEdge(edges) {
    let min_year = 99999;
    let min_edge = null;
    edges.forEach((edge) => {
      if (edge.node.startDate.year < min_year) {
        min_year = edge.node.startDate.year;
        min_edge = edge;
      } else if (edge.node.startDate.year == min_year) {
        // console.log(
        //   "same year release!",
        //   edge.node.startDate.year,
        //   edge.node,
        //   min_edge.node
        // );
        if (edge.node.popularity > min_edge.node.popularity) {
          // console.log(
          //   "new series wins by popularity",
          //   edge.node.title.romaji,
          //   edge.node.popularity,
          //   min_edge.node.title.romaji,
          //   min_edge.node.popularity
          // );
          min_edge = edge; // In case of same year releases, pick the one with the highest popularity
        } else {
          // console.log(
          //   "current series wins by popularity",
          //   min_edge.node.title.romaji,
          //   min_edge.node.popularity,
          //   edge.node.title.romaji,
          //   edge.node.popularity
          // );
        }
      }
    });
    // console.log(
    //   `[${this.name}]::GetDefaultEdge`,
    //   "Oldest edge: ",
    //   min_year,
    //   min_edge
    // );
    return min_edge;
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
        }
      }
    }
  `;
}
