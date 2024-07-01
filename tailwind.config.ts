import { type Config } from "tailwindcss";
import TailwindForm from "@tailwindcss/forms";
export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    TailwindForm,
  ],
} satisfies Config;
