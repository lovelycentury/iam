import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: "okryshto",
      accountThemeImplementation: "none",
      startKeycloakOptions: {
        dockerImage: "quay.io/keycloak/keycloak:26.7.2",
      },
    }),
  ],
});
