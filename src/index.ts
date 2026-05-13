interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Hugging Face Hub MCP — models, datasets, spaces
 *
 * Auth: optional bearer token (only required for gated/private repos
 * or to raise rate limits). Public reads work without one.
 *
 * Docs: https://huggingface.co/docs/hub/api
 */


const BASE = 'https://huggingface.co/api';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_models',
    description: 'Browse / search models on the Hub.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Free-text — name / description' },
        author: { type: 'string', description: 'Filter by org or user (e.g. "meta-llama")' },
        library: { type: 'string', description: 'transformers | diffusers | sentence-transformers | ...' },
        language: { type: 'string', description: 'ISO language code' },
        pipeline_tag: {
          type: 'string',
          description: 'text-generation | text-classification | image-classification | translation | ...',
        },
        tags: { type: 'string', description: 'Comma-separated tags' },
        sort: { type: 'string', description: 'downloads | likes | trending_score | lastModified | createdAt' },
        direction: { type: 'string', description: '-1 (desc, default) | 1 (asc)' },
        limit: { type: 'number', description: '1-1000 (default 20)' },
        full: { type: 'boolean', description: 'Include extra fields (cardData, gated, etc.)' },
      },
    },
  },
  {
    name: 'search_datasets',
    description: 'Browse / search datasets on the Hub.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        author: { type: 'string' },
        language: { type: 'string' },
        task_categories: { type: 'string', description: 'Comma-separated task categories' },
        sort: { type: 'string' },
        direction: { type: 'string' },
        limit: { type: 'number' },
        full: { type: 'boolean' },
      },
    },
  },
  {
    name: 'search_spaces',
    description: 'Browse / search Spaces (demo apps).',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        author: { type: 'string' },
        sdk: { type: 'string', description: 'gradio | streamlit | docker | static' },
        sort: { type: 'string' },
        direction: { type: 'string' },
        limit: { type: 'number' },
        full: { type: 'boolean' },
      },
    },
  },
  {
    name: 'get_model',
    description: 'Detailed model info — config, tags, downloads, files at root.',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: { type: 'string', description: '<author>/<repo> or <repo> for HF-owned' },
        revision: { type: 'string', description: 'Branch/commit/tag (default main)' },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'get_dataset',
    description: 'Detailed dataset info.',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: { type: 'string' },
        revision: { type: 'string' },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'get_space',
    description: 'Detailed Space info.',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: { type: 'string' },
        revision: { type: 'string' },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'list_model_files',
    description: 'List files at the root of a model repo.',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: { type: 'string' },
        revision: { type: 'string', description: 'Branch/commit/tag (default main)' },
        path: { type: 'string', description: 'Subdirectory (default root)' },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'list_dataset_files',
    description: 'List files in a dataset repo.',
    inputSchema: {
      type: 'object',
      properties: {
        repo_id: { type: 'string' },
        revision: { type: 'string' },
        path: { type: 'string' },
      },
      required: ['repo_id'],
    },
  },
  {
    name: 'trending_models',
    description: 'Currently-trending models on the Hub.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: '1-100 (default 20)' } },
    },
  },
  {
    name: 'trending_datasets',
    description: 'Currently-trending datasets.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: '1-100 (default 20)' } },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  switch (name) {
    case 'search_models':
      return hfList(apiKey, '/models', args);
    case 'search_datasets':
      return hfList(apiKey, '/datasets', args);
    case 'search_spaces':
      return hfList(apiKey, '/spaces', args);
    case 'get_model':
      return hfGetRepo(apiKey, 'models', args);
    case 'get_dataset':
      return hfGetRepo(apiKey, 'datasets', args);
    case 'get_space':
      return hfGetRepo(apiKey, 'spaces', args);
    case 'list_model_files':
      return hfListFiles(apiKey, 'models', args);
    case 'list_dataset_files':
      return hfListFiles(apiKey, 'datasets', args);
    case 'trending_models':
      return hfList(apiKey, '/models', { sort: 'trending_score', direction: '-1', limit: (args.limit as number) ?? 20 });
    case 'trending_datasets':
      // /datasets doesn't expose a trending sort; "most liked" is the closest proxy.
      return hfList(apiKey, '/datasets', { sort: 'likes', direction: '-1', limit: (args.limit as number) ?? 20 });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function hfList(apiKey: string | undefined, path: string, args: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const k of [
    'search', 'author', 'library', 'language', 'pipeline_tag', 'tags',
    'task_categories', 'sdk', 'sort', 'direction',
  ] as const) {
    if (args[k] !== undefined && args[k] !== null && args[k] !== '') {
      params.set(k === 'task_categories' ? 'task_categories' : k, String(args[k]));
    }
  }
  params.set('limit', String(Math.min(1000, Math.max(1, (args.limit as number) ?? 20))));
  if (args.full === true) params.set('full', 'true');
  return hfGet(apiKey, `${path}?${params}`);
}

async function hfGetRepo(apiKey: string | undefined, kind: 'models' | 'datasets' | 'spaces', args: Record<string, unknown>) {
  const repoId = reqStr(args, 'repo_id', '"meta-llama/Meta-Llama-3-8B"');
  const revision = (args.revision as string | undefined) ?? 'main';
  return hfGet(apiKey, `/${kind}/${encodeURI(repoId)}/revision/${encodeURIComponent(revision)}`);
}

async function hfListFiles(apiKey: string | undefined, kind: 'models' | 'datasets', args: Record<string, unknown>) {
  const repoId = reqStr(args, 'repo_id', '"meta-llama/Meta-Llama-3-8B"');
  const revision = (args.revision as string | undefined) ?? 'main';
  const path = ((args.path as string | undefined) ?? '').replace(/^\/+|\/+$/g, '');
  const url = `/${kind}/${encodeURI(repoId)}/tree/${encodeURIComponent(revision)}${path ? `/${encodeURI(path)}` : ''}`;
  return hfGet(apiKey, url);
}

async function hfGet(apiKey: string | undefined, path: string) {
  const url = `${BASE}${path}`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const res = await fetch(url, { headers });
  if (res.status === 401) throw new Error('Hugging Face: unauthorized — token required for gated repos');
  if (res.status === 404) throw new Error('Hugging Face: not found');
  if (res.status === 429) throw new Error('Hugging Face: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Hugging Face error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
