'use strict';

const pages = [
  `https://dev.cartpanda.com/api/v1/projects/${Buffer.from('prj:85563').toString('base64')}/nodes/e9906233413a2`,
];
async function main() {
  for (const url of pages) {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const text = await response.text();
    if ((response.headers.get('content-type') || '').includes('application/json')) {
      const resource = JSON.parse(text);
      const operation = typeof resource.data === 'string' ? JSON.parse(resource.data) : resource.data;
      if (operation) {
        const body = operation.request?.body?.contents?.[0];
        console.log(JSON.stringify({ url, status: response.status, links: resource.links, resourceFields: Object.keys(resource), operationFields: Object.keys(operation), method: operation.method, path: operation.path, paths: operation.paths, servers: operation.servers, security: operation.security, schema: body?.schema, bodyExamples: body?.examples?.map((example) => Object.fromEntries(Object.entries(example.value || {}).filter(([key]) => !['images', 'variants'].includes(key)))) }, null, 2));
        continue;
      }
    }
    const body = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const scripts = [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
    for (const script of scripts.filter((value) => value.startsWith('window.URQL_DATA = '))) {
      const state = JSON.parse(script.slice('window.URQL_DATA = '.length).replace(/;\s*$/, ''));
      for (const entry of Object.values(state)) {
        if (typeof entry.data === 'string') {
          const data = JSON.parse(entry.data);
          console.log(JSON.stringify(data));
        }
      }
    }
    console.log(JSON.stringify({ url, status: response.status, content: body.slice(0, 16000) }));
  }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
