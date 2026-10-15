import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { espresso: "#24150F", gold: "#B8862F", champagne: "#D8B56A", ivory: "#FAF7F2" } } },
  plugins: []
};
export default config;