/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activities from "../activities.js";
import type * as defaultLists from "../defaultLists.js";
import type * as experiences from "../experiences.js";
import type * as games from "../games.js";
import type * as groups from "../groups.js";
import type * as invites from "../invites.js";
import type * as lists from "../lists.js";
import type * as movies from "../movies.js";
import type * as places from "../places.js";
import type * as search from "../search.js";
import type * as series from "../series.js";
import type * as sessions from "../sessions.js";
import type * as userActivities from "../userActivities.js";
import type * as userEvents from "../userEvents.js";
import type * as users from "../users.js";
import type * as watch from "../watch.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  defaultLists: typeof defaultLists;
  experiences: typeof experiences;
  games: typeof games;
  groups: typeof groups;
  invites: typeof invites;
  lists: typeof lists;
  movies: typeof movies;
  places: typeof places;
  search: typeof search;
  series: typeof series;
  sessions: typeof sessions;
  userActivities: typeof userActivities;
  userEvents: typeof userEvents;
  users: typeof users;
  watch: typeof watch;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
