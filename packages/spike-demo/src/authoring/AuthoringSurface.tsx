import { useState } from "react";
import { useSalaiController } from "../controller";
import type { AuthoringAdapter } from "./contract";
import { deterministicAuthoringAdapter } from "./deterministic-adapter";
import { runAuthoringTurn } from "./result";

type AuthoringStatus =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "success"; summary: string; answer?: string }
  | { kind: "error"; message: string };

export function AuthoringSurface({
  adapter = deterministicAuthoringAdapter,
}: {
  adapter?: AuthoringAdapter;
}) {
  const controller = useSalaiController();
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState<AuthoringStatus>({ kind: "idle" });

  async function processAndApply() {
    setStatus({ kind: "running" });
    try {
      const execution = await runAuthoringTurn(controller, adapter, instruction);
      setStatus({
        kind: "success",
        summary: execution.result.summary,
        ...(execution.result.answer === undefined
          ? {}
          : { answer: execution.result.answer }),
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <section className="authoring-panel" aria-label="Free-form authoring">
      <div className="authoring-copy">
        <span className="eyebrow">Free-form authoring</span>
        <h2>Express the change in ordinary language</h2>
        <p>
          0C currently uses a deterministic adapter. The same structured result boundary will
          be used by the live browser model adapter.
        </p>
      </div>
      <div className="authoring-input-area">
        <textarea
          value={instruction}
          onChange={(event) => {
            setInstruction(event.target.value);
            if (status.kind !== "running") setStatus({ kind: "idle" });
          }}
          placeholder="Example: Make the opening more direct"
          aria-label="Authoring instruction"
          rows={3}
        />
        <div className="authoring-actions">
          <button
            type="button"
            className="authoring-run-button"
            disabled={status.kind === "running" || instruction.trim().length === 0}
            onClick={() => void processAndApply()}
          >
            {status.kind === "running" ? "Processing…" : "Process & apply"}
          </button>
          <span className="authoring-hint">Narrative Lenses remain available below.</span>
        </div>
        {status.kind === "success" ? (
          <div className="authoring-result" role="status">
            <strong>{status.summary}</strong>
            {status.answer ? <p>{status.answer}</p> : null}
          </div>
        ) : null}
        {status.kind === "error" ? (
          <div className="authoring-result authoring-result-error" role="alert">
            {status.message}
          </div>
        ) : null}
      </div>
    </section>
  );
}
