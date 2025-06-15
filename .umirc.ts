import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'cnpm',
});
