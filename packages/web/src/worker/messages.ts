import type { QuicktypeRequest, QuicktypeResponse } from "../types";

export type WorkerRequest =
    | { type: "init" }
    | ({ type: "run" } & QuicktypeRequest);

export type WorkerResponse =
    | { type: "languages"; languages: import("../types").LanguageInfo[] }
    | ({ type: "run" } & QuicktypeResponse);
