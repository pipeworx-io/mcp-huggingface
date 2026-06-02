# mcp-huggingface

Hugging Face Hub MCP — models, datasets, spaces

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_models` | Browse / search models on the Hub. |
| `search_datasets` | Browse / search datasets on the Hub. |
| `search_spaces` | Browse / search Spaces (demo apps). |
| `get_model` | Detailed model info — config, tags, downloads, files at root. |
| `get_dataset` | Detailed dataset info. |
| `get_space` | Detailed Space info. |
| `list_model_files` | List files at the root of a model repo. |
| `list_dataset_files` | List files in a dataset repo. |
| `trending_models` | Currently-trending models on the Hub. |
| `trending_datasets` | Currently-trending datasets. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
