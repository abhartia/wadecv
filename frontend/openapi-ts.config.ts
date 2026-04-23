import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../backend/openapi.json",
  output: "src/gen/hey-api",
  plugins: [
    {
      name: "@tanstack/react-query",
      queryOptions: true,
      queryKeys: true,
    },
  ],
});
