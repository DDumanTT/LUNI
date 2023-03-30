import * as functions from "firebase-functions";
import apicalypse, {Apicalypse} from "apicalypse";
import axios, {AxiosResponse} from "axios";
import igdb from "igdb-api-node";

interface AuthResp {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface GameResponse {
  name: string;
  result: Record<any, any>[];
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

export const gamesInfo = functions.region("europe-west1")
  .https.onRequest(async (req, resp) => {
    if (req.method !== "POST") {
      resp.json({success: false, message: "Only POST request supported."});
      return;
    }
    const client = await igdbAuth();
    if (!client) {
      resp.json({success: false, message: "Unauthorized."});
      return;
    }
    const allGames = (req.body.games as string[])
      .reduce<string[][]>((result, name, index) => {
        const chunkIndex = Math.floor(index / 10);
        if (!result[chunkIndex]) result[chunkIndex] = [];
        result[chunkIndex].push(name);
        return result;
      }, []);
    const promises = allGames.map((names) => {
      return client
        .multi(
          names.map((name: string) =>
            apicalypse()
              .query("games", name)
              .fields(["cover.*"])
              .where(`name = "${name}"`)
              .sort("follows", "desc")
              .limit(1)
          )
        )
        .request("/multiquery") as Promise<AxiosResponse<GameResponse[]>>;
    });
    return Promise.all(promises)
      .then((res) => {
        const games = [] as GameResponse[];
        res.forEach((r) => {
          games.push(...r.data);
        });
        resp.json(games);
      });
  });
