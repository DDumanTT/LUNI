import * as functions from "firebase-functions";
import * as cors from "cors";
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

const corsHandler = cors({origin: true});

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

const igdbFields = ["name", "cover.*"];

// export const getGamesInfo = functions.region("europe-west1")
//   .https.onCall(async (data, context) => {
//     const games = data.games;

//   })

// export const gamesInfo = functions.region("europe-west1")
//   .https.onRequest((req, resp) => {
//     corsHandler(req, resp, async () => {
//       if (req.method !== "POST") {
//         resp.json({success: false, message: "Only POST request supported."});
//         return;
//       }
//       const client = await igdbAuth();
//       if (!client) {
//         resp.json({success: false, message: "Unauthorized."});
//         return;
//       }
//       const allGames = (req.body.games as string[])
//         .reduce<string[][]>((result, name, index) => {
//           const groupIndex = Math.floor(index / 10);
//           if (!result[groupIndex]) result[groupIndex] = [];
//           result[groupIndex].push(name);
//           return result;
//         }, []);
//       const promises = allGames.map((names) => {
//         return client
//           .multi(
//             names.map((name: string) =>
//               apicalypse()
//                 .query("games", name)
//                 .fields(igdbFields)
//                 .where(`name = "${name}"`)
//                 .sort("follows", "desc")
//                 .limit(1)
//             )
//           )
//           .request("/multiquery") as Promise<AxiosResponse<GameResponse[]>>;
//       });
//       const groups = await Promise.all(promises);
//       const retryPromises = [] as Promise<AxiosResponse<GameResponse>>[];
//       const games = [] as GameResponse[];
//       groups.forEach(group => {
//         group.data.forEach(game => {
//           if (game.result.length !== 0) return games.push(game);
//           return retryPromises.push(
//             client.fields(igdbFields)
//               .search(game.name)
//               .limit(1)
//               .request("/games") as Promise<AxiosResponse<GameResponse>>)
//         })
//       });
//       const retriedRequests = await Promise.all(retryPromises);
//       console.log(retriedRequests)
//       retriedRequests.forEach(req => {
//         if (req.data.result.length !== 0) games.push(req.data);
//       });
//       return resp.json(games);
      // ------------
      // return Promise.all(promises)
      //   .then((res) => {
      //     const games = [] as GameResponse[];
      //     res.forEach((r) => {
      //       const promises = r.data.filter((game) => game.result.length === 0)
      //         .map((game) => {
      //           return client.fields(igdbFields)
      //             .search(game.name)
      //             .limit(1)
      //             .request("/games") as Promise<AxiosResponse<GameResponse>>;
      //         });
      //       console.log(promises);
      //       Promise.all(promises).then((resp) => {
      //         // console.log(JSON.string ify(resp[0].data, null, 2));
      //         resp.forEach((game) => games.push(game.data));
      //       });
      //       games.push(...r.data.filter((game) => game.result.length !== 0));
      //     });
      //     resp.json(games);
      //   });
    // });
  // });
