import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
import "@okkly/design-system/styles/index.scss";
import "@okkly/react/style.css";
import "./login/iam.scss";

// Uncomment to preview a page with `pnpm --filter @okkly/iam dev`.
// Comment it back before `build-keycloak-theme` or the mock ships in the JAR.
/*
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: "login.ftl",
    overrides: {},
  });
}
*/

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!window.kcContext ? <h1>No Keycloak Context</h1> : <KcPage kcContext={window.kcContext} />}
  </StrictMode>,
);
