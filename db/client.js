// connection management

import dotenv from "dotenv";
import { connect } from "@tursodatabase/serverless";

dotenv.config();
let dbPromise = null; //only one connection is created for the whole app

export function getDb() {
  if (!dbPromise) {
    dbPromise = connect({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_KEY,
    });
  }
  return dbPromise;
}
