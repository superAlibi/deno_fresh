import { Pool } from "postgre";

export const pgpool = new Pool({}, 10);
globalThis.addEventListener("unload", () => pgpool.end());
