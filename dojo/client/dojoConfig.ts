import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contract/target/dev/manifest.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
