import {fileURLToPath} from 'node:url';
process.env.ERP_DEPLOY_TARGET='cloudflare';
const cli=new URL('../../node_modules/vinext/dist/cli.js',import.meta.url);
process.argv=[process.execPath,fileURLToPath(cli),'build'];
await import(cli.href);
