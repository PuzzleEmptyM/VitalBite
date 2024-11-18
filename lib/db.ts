import { Generated } from "kysely";
import { createKysely } from "@vercel/postgres-kysely";

export interface Database {
  titles: TitlesTable;
  users: UsersTable;
  favorites: FavoritesTable;
  watchlater: WatchLaterTable;
  activities: ActivitiesTable;
}

export interface TitlesTable {
  id: Generated<string>;
  title: string;
  synposis: string;
  released: number;
  genre: string;
}

export interface UsersTable {
  id: Generated<string>;
  name: string;
  email: string;
  password: string;
}

export interface FavoritesTable {
  id: Generated<string>;
  title_id: Generated<string>;
  user_id: Generated<string>;
}

export interface WatchLaterTable {
  id: Generated<string>;
  title_id: Generated<string>;
  user_id: Generated<string>;
}

export interface ActivitiesTable {
  id: Generated<string>;
  timestamp: Date;
  title_id: string;
  user_id: string;
  activity: "FAVORITED" | "WATCH_LATER";
}

export const db = createKysely<Database>();
