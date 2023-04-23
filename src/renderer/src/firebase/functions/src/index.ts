import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Apicalypse} from "apicalypse";
import axios from "axios";
import igdb from "igdb-api-node";

admin.initializeApp();

interface AuthResp {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface GameInfoRequest {
  game: string;
  fields: string[]
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

export const getGameData = functions.region("europe-west1")
  .https.onCall(async (data: GameInfoRequest, context) => {
    if (!data.game) {
      throw new functions.https.HttpsError(
        "invalid-argument", "Missing game name");
    }
    if (!data.fields) {
      throw new functions.https.HttpsError(
        "invalid-argument", "Missing query fields");
    }
    const client = await igdbAuth();
    if (!client) {
      throw new functions.https.HttpsError(
        "unauthenticated", "IGDB unauthorized");
    }
    let res;
    try {
      res = await client
        .fields(data.fields.includes("category") ?
          data.fields :
          data.fields.concat(["category"]))
        .search(data.game)
        .request("/games");
    } catch (err) {
      throw new functions.https.HttpsError(
        "unavailable", "Failed to get game data from IGDB");
    }
    return res.data.sort(
      (a: {category: number}, b: {category: number}) =>
        (a.category - b.category) ||
        Object.keys(b).length - Object.keys(a).length)[0];
  });

export const onUserCreated = functions.auth.user().onCreate((user) => {
  const {uid, email, displayName} = user;
  return admin.firestore().collection("users").doc(uid).set({
    email,
    displayName,
  });
});
