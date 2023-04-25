import { UserInfo } from 'firebase/auth';

export type LauncherPaths = {
  [key: string]: string;
  steam: string;
  epic: string;
  ea: string;
  ubisoft: string;
};

export interface Game {
  id: string;
  launcher: string;
  name: string;
  path: string;
  isFavorite: boolean;
  executable?: string;
  icon?: string;
  logo?: string;
  cover?: string;
  hero?: string;
}

export interface IgdbGame {
  id: number;
  name: string;
  summary: string;
  aggregated_rating: number;
  alternative_names: AlternativeName[];
  first_release_date: number;
  game_modes: GameMode[];
  genres: Genre[];
  involved_companies: InvolvedCompany[];
  keywords: Keyword[];
  platforms: Platform[];
  player_perspectives: PlayerPerspective[];
  release_dates: ReleaseDate[];
  screenshots: Image[];
  themes: Theme[];
  websites: Website[];
  language_supports: LanguageSupports[];
  cover: Image;
}

interface AlternativeName {
  id: number;
  name: string;
  comment: string;
}
interface GameMode {
  id: number;
  name: string;
}
interface Genre {
  id: number;
  name: string;
}
interface Keyword {
  id: number;
  name: string;
}
interface PlayerPerspective {
  id: number;
  name: string;
}
interface Image {
  id: number;
  image_id: string;
}
interface Theme {
  id: number;
  name: string;
}
interface Language {
  id: number;
  name: string;
}
interface LanguageSupportType {
  id: number;
  name: string;
}
interface Website {
  id: number;
  url: string;
  category?: number;
}
interface Company {
  id: number;
  name: string;
  websites: Website[];
  logo: Image;
  description: string;
}
interface InvolvedCompany {
  id: number;
  company: Company;
  developer: boolean;
  publisher: boolean;
}
interface Platform {
  id: number;
  name: string;
  platform_logo?: Image;
  websites?: Website[];
}
interface ReleaseDate {
  id: number;
  date: number;
  human: string;
  platform: Platform;
  region: number;
}
interface LanguageSupports {
  id: number;
  language: Language;
  language_support_type: LanguageSupportType;
}

export interface Message {
  text: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  sender: string;
}
