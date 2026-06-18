import type { WorkerRequest, WorkerResponse } from "./messages";

import { getLanguageCatalog, runQuicktype } from "./runQuicktype";

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
    const message = event.data;

    if (message.type === "init") {
        const response: WorkerResponse = {
            type: "languages",
            languages: getLanguageCatalog(),
        };
        self.postMessage(response);
        return;
    }

    const { type: _type, ...request } = message;
    const response: WorkerResponse = {
        type: "run",
        ...(await runQuicktype(request)),
    };
    self.postMessage(response);
};
