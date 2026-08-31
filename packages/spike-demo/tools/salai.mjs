const BRIDGE_URL = process.env.SALAI_BRIDGE_URL ?? "http://127.0.0.1:4317";

const TOOL_MANIFEST = {
  version: 1,
  interface: "salai-cli",
  tools: [
    {
      name: "context",
      command: "pnpm salai context",
      description: "Read current canonical Salai project, Workspace context, and active Narrative Lens.",
      mutatesProject: false,
      requiresLiveProject: true,
      input: { kind: "none" },
    },
    {
      name: "create-story",
      command: "pnpm salai create-story <json-or-stdin>",
      description: "Create the initial story on an empty project using Salai-owned ID and placement resolution.",
      mutatesProject: true,
      requiresLiveProject: true,
      input: {
        kind: "json",
        shape: "{ sectionTitle?: string, beats: Array<{ title?: string, summary?: string }> }",
        constraints: ["beats must be non-empty", "current story must be empty"],
      },
    },
    {
      name: "apply",
      command: "pnpm salai apply <json-or-stdin>",
      description: "Apply one non-empty atomic NarrativeOperation[] batch to the current project.",
      mutatesProject: true,
      requiresLiveProject: true,
      input: {
        kind: "json",
        shape: "NarrativeOperation[]",
        schemaRef: "docs/narrative-ir-spec.md",
        constraints: ["batch must be non-empty", "operations use the public Narrative IR vocabulary"],
      },
    },
  ],
};

async function invoke(command, payload) {
  const response = await fetch(`${BRIDGE_URL}/invoke`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ command, ...(payload === undefined ? {} : { payload }) }),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(body.error ?? `Salai bridge returned ${response.status}`);
  return body.result;
}

async function readStdin() {
  let text = "";
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

async function readJsonArgument(usage) {
  const text = process.argv[3] ?? (process.stdin.isTTY ? "" : await readStdin());
  if (!text.trim()) throw new Error(usage);
  return JSON.parse(text);
}

async function main() {
  const command = process.argv[2];
  if (command === "tools") {
    console.log(JSON.stringify(TOOL_MANIFEST, null, 2));
    return;
  }

  if (command === "context") {
    console.log(JSON.stringify(await invoke("context"), null, 2));
    return;
  }

  if (command === "apply") {
    const payload = await readJsonArgument(
      "Usage: salai apply '<NarrativeOperation[] JSON>' or pipe JSON on stdin",
    );
    console.log(JSON.stringify(await invoke("apply", payload), null, 2));
    return;
  }

  if (command === "create-story") {
    const payload = await readJsonArgument(
      "Usage: salai create-story '<{sectionTitle?, beats:[...]}> JSON' or pipe JSON on stdin",
    );
    console.log(JSON.stringify(await invoke("createStory", payload), null, 2));
    return;
  }

  throw new Error("Usage: salai tools | salai context | salai apply <json> | salai create-story <json>");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
