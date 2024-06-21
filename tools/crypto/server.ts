import { getServerSecretKey } from "../../denokv/serverkey.ts";
import { AESCBC } from "./aes.ts";

export const CurrentAES = new AESCBC(await getServerSecretKey());
