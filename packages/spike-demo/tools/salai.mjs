const BRIDGE_URL = process.env.SALAI_BRIDGE_URL ?? "http://127.0.0.1:4317";

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

  throw new Error("Usage: salai context | salai apply <json> | salai create-story <json>");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
