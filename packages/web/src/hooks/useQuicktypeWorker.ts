import { useCallback, useEffect, useRef, useState } from "react";

import type { WorkerRequest, WorkerResponse } from "../lib/languages";
import type { LanguageInfo, QuicktypeRequest } from "../types";

export function useQuicktypeWorker() {
    const workerRef = useRef<Worker | null>(null);
    const [languages, setLanguages] = useState<LanguageInfo[]>([]);
    const [ready, setReady] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const worker = new Worker(
            new URL("../worker/quicktype.worker.bundle.js", import.meta.url),
            { type: "module" },
        );
        workerRef.current = worker;

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const response = event.data;
            if (response.type === "languages") {
                setLanguages(response.languages);
                setReady(true);
                return;
            }

            if (response.ok) {
                setCode(response.code);
                setError(null);
            } else {
                setCode("");
                setError(response.error);
            }
            setRunning(false);
        };

        worker.onerror = (event) => {
            setError(event.message || "Worker failed.");
            setRunning(false);
        };

        worker.postMessage({ type: "init" } satisfies WorkerRequest);

        return () => {
            worker.terminate();
        };
    }, []);

    const run = useCallback((request: QuicktypeRequest) => {
        if (!workerRef.current || !ready) {
            return;
        }
        setRunning(true);
        workerRef.current.postMessage({
            type: "run",
            ...request,
        } satisfies WorkerRequest);
    }, [ready]);

    return { languages, ready, code, error, running, run };
}
