import {env} from 'cloudflare:workers';
import {ApiError,database} from './server';
import {d1Evidence} from './d1-evidence';
export function evidenceStore(){
 if(env.ERP_EVIDENCE_STORAGE==='d1')return d1Evidence(database());
 if(env.BUCKET)return env.BUCKET;
 throw new ApiError('檔案儲存尚未連接。',503);
}
