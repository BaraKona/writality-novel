import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "../../db/schema";

export const database = drizzle(
  async (...args) => {
    try {
      const result = await window.api.execute(...args);
      return { rows: result };
    } catch (e) {
      console.error("Error from sqlite proxy server: ", e.response.data);
      return { rows: [] };
    }
  },
  {
    schema: schema,
  },
);

export const serialize = (data: unknown): string => {
  return JSON.stringify(data);
};

export const deserialize = (data: string | null | unknown): unknown => {
  if (!data) return null;

  return JSON.parse(data as string);
};
