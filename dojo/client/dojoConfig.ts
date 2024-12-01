import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contract/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "http://127.0.0.1:5050",
    toriiUrl: "http://127.0.0.1:8080",
    relayUrl: "/ip4/127.0.0.1/tcp/9090",
});
