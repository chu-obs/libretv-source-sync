import { writeFile } from 'node:fs/promises';

const upstream = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/jin18.json';
const response = await fetch(upstream, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) {
  throw new Error(`无法下载 jin18.json（HTTP ${response.status}）`);
}

const { api_site: apiSites } = await response.json();
if (!apiSites || typeof apiSites !== 'object' || Array.isArray(apiSites)) {
  throw new Error('jin18.json 缺少 api_site 对象');
}

const sources = Object.entries(apiSites).map(([key, entry]) => {
  const { name, api, detail } = entry ?? {};
  if (typeof name !== 'string' || !name.trim() || typeof api !== 'string') {
    throw new Error(`点播源 ${key} 缺少名称或 API 地址`);
  }

  if (!URL.canParse(api) || !/^https?:\/\//i.test(api)) {
    throw new Error(`点播源 ${key} 的 API 地址无效`);
  }

  return {
    name,
    url: api,
    ...(typeof detail === 'string' && detail.trim() ? { detail } : {}),
  };
});

if (sources.length === 0) {
  throw new Error('jin18.json 的点播源列表为空');
}

const output = { name: 'LunaTV jin18', version: 2, sources };
await writeFile(new URL('./sources.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`已转换 ${sources.length} 个点播源。`);
