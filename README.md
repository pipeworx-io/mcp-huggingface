# @pipeworx/huggingface

Hugging Face Hub MCP — search and inspect models, datasets, and Spaces on the largest open ML repository. No auth required for public reads.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `search_models(search?, author?, library?, language?, pipeline_tag?, tags?, sort?, direction?, limit?, full?)`
- `search_datasets(search?, author?, language?, task_categories?, sort?, direction?, limit?, full?)`
- `search_spaces(search?, author?, sdk?, sort?, direction?, limit?, full?)`
- `get_model(repo_id, revision?)`
- `get_dataset(repo_id, revision?)`
- `get_space(repo_id, revision?)`
- `list_model_files(repo_id, revision?)` / `list_dataset_files(repo_id, revision?)`
- `trending_models(limit?)` / `trending_datasets(limit?)`

## Auth

Public reads are keyless. Higher rate limits and gated/private repos require a token — optional:

- **Platform key (optional):** gateway env `PLATFORM_HF_KEY`
- **BYO (optional):** `?_apiKey=<hf_token>`

## Data source

`https://huggingface.co/api/` — public REST.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "huggingface": {
      "url": "https://gateway.pipeworx.io/huggingface/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/huggingface/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Huggingface data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/huggingface_search_models \
  -H 'Content-Type: application/json' \
  -d '{"search":"bert","library":"transformers","limit":20}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/huggingface_search_models`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
