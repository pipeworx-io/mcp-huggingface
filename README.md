# @pipeworx/huggingface

Hugging Face Hub MCP — search and inspect models, datasets, and Spaces on the largest open ML repository. No auth required for public reads.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Huggingface data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
