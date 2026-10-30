import {headers} from 'next/headers';
import {requireChatGPTUser} from './chatgpt-auth';import ERPApp from './erp-app';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireChatGPTUser('/');const h=await headers();return <ERPApp displayName={h.get('x-journey-username')||user.displayName} readOnly={h.get('x-journey-role')==='viewer'} standalone={!!h.get('x-journey-role')}/>}
