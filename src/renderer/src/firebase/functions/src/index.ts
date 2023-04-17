import * as functions from "firebase-functions";
import {Apicalypse} from "apicalypse";
import axios from "axios";
import igdb from "igdb-api-node";

interface AuthResp {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Authenticates IGDB client
 * @return {Promise<Apicalypse | undefined>}
 * Ready to use IGDB client instance or undefined if auth fails
 */
async function igdbAuth() {
  let igdbClient: Apicalypse | undefined;
  if (igdbClient) return igdbClient;
  try {
    const res = await axios.post<AuthResp>("https://id.twitch.tv/oauth2/token", null, {
      params: {
        client_id: process.env.IGDB_API_CLIENT_ID,
        client_secret: process.env.IGDB_API_SECRET,
        grant_type: "client_credentials",
      },
    });
    igdbClient = igdb(process.env.IGDB_API_CLIENT_ID, res.data.access_token);
    return igdbClient;
  } catch (err) {
    console.log(err);
    return;
  }
}

const igdbFields = [
  "name",
  "alternative_names.name",
  "aggregated_rating",
  "first_release_date",
  "game_modes.name",
  "genres.name",
  "involved_companies.developer",
  "involved_companies.publisher",
  "involved_companies.company.name",
  "involved_companies.company.logo.image_id",
  "involved_companies.company.websites.url",
  "involved_companies.company.description",
  "keywords.name",
  "language_supports.language_support_type.name",
  "language_supports.language.name",
  "multiplayer_modes.*",
  "platforms.name",
  "platforms.platform_logo.image_id",
  "platforms.websites.url",
  "player_perspectives.name",
  "release_dates.human",
  "release_dates.date",
  "release_dates.platform.name",
  "release_dates.region",
  "screenshots.image_id",
  "summary",
  "themes.name",
  "websites.category",
  "websites.url",
];

export const getGameData = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    if (!data.game) {
      throw new functions.https.HttpsError(
        "invalid-argument", "Missing game name");
    }
    const client = await igdbAuth();
    if (!client) {
      throw new functions.https.HttpsError(
        "unauthenticated", "IGDB unauthorized");
    }
    let res;
    try {
      res = await client
        .fields(igdbFields)
        .search(data.game)
        .limit(1)
        .request("/games");
    } catch (err) {
      throw new functions.https.HttpsError(
        "unavailable", "Failed to get game data from IGDB");
    }
    return res.data[0];
  });
