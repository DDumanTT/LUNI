import { firebaseApp } from '.';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(firebaseApp);
functions.region = 'europe-west1';
// connectFunctionsEmulator(functions, 'localhost', 5001);

export const getGameData = (game: string) =>
  httpsCallable(functions, 'getGameData')({ game, fields: igdbFields });

const igdbFields = [
  'name',
  'alternative_names.name',
  'alternative_names.comment',
  'aggregated_rating',
  'first_release_date',
  'game_modes.name',
  'genres.name',
  'involved_companies.developer',
  'involved_companies.publisher',
  'involved_companies.company.name',
  'involved_companies.company.logo.image_id',
  'involved_companies.company.websites.url',
  'involved_companies.company.description',
  'keywords.name',
  'language_supports.language_support_type.name',
  'language_supports.language.name',
  'multiplayer_modes.*',
  'platforms.name',
  'platforms.platform_logo.image_id',
  'platforms.websites.url',
  'player_perspectives.name',
  'release_dates.human',
  'release_dates.date',
  'release_dates.platform.name',
  'release_dates.region',
  'screenshots.image_id',
  'summary',
  'themes.name',
  'websites.category',
  'websites.url',
  'cover.image_id',
];

export const getRecommendedUsers = httpsCallable(functions, 'getRecommendedFriends');
