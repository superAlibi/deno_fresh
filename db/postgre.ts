import { Pool } from "postgre";

await import("$std/dotenv/load.ts");

export const pgpool = new Pool({}, 10);
globalThis.addEventListener("unload", () => pgpool.end())