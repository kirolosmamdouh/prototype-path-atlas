import { supabase } from '@/integrations/supabase/client';
import type { Campaign, Store, User } from './types';

export const EMPTY_STORE: Store = { users: [], campaigns: [], applications: [], messages: [], notifications: [] };
export type Workspace = { id: string; name: string; owner_id: number; agency: boolean };
export type ClientBrand = { id: string; workspace_id: string; name: string };
export function check(error: { message: string } | null) { if (error) throw new Error(error.message); }

export async function loadMarketplace(email: string, authId: string) {
  const [p,r,c,a,m,n,w,b,s] = await Promise.all([
    supabase.from('profiles').select('*'), supabase.from('user_roles').select('*'),
    supabase.from('campaigns').select('*'), supabase.from('applications').select('*'),
    supabase.from('messages').select('*'), supabase.from('notifications').select('*'),
    supabase.from('workspaces').select('*'), supabase.from('client_brands').select('*'),
    supabase.from('saved_campaigns').select('*'),
  ]);
  for (const result of [p,r,c,a,m,n,w,b,s]) check(result.error);
  const users: User[] = (p.data ?? []).flatMap(x => {
    const role = r.data?.find(y => y.profile_id === x.id)?.role;
    if (role !== 'brand' && role !== 'creator') return [];
    return [{ id:x.id, authId:x.auth_id, name:x.name, role, email:x.auth_id===authId?email:'', company:x.company??undefined, niche:x.niche??undefined, location:x.location??undefined, bio:x.bio??undefined, platforms:x.platforms.filter((v): v is 'TikTok'|'Instagram'|'YouTube' => ['TikTok','Instagram','YouTube'].includes(v)), rate:x.rate??undefined, followers:x.followers??undefined, verified:x.verified }];
  });
  const campaigns: Campaign[] = (c.data ?? []).map(x => ({ id:x.id,userId:x.owner_id,workspaceId:x.workspace_id,clientBrandId:x.client_brand_id??undefined,title:x.title,description:x.description,niche:x.niche,platform:x.platform as Campaign['platform'],budget:x.budget,deliverables:x.deliverables,deadline:x.deadline,status:x.status as Campaign['status'],createdAt:x.created_at }));
  const store: Store = { users,campaigns, applications:(a.data??[]).map(x=>({id:x.id,campaignId:x.campaign_id,creatorId:x.creator_id,pitch:x.pitch,rate:x.rate,status:x.status as Store['applications'][number]['status'],createdAt:x.created_at})), messages:(m.data??[]).map(x=>({id:x.id,senderId:x.sender_id,receiverId:x.receiver_id,body:x.body,isRead:x.is_read,createdAt:x.created_at})), notifications:(n.data??[]).map(x=>({id:x.id,userId:x.user_id,title:x.title,body:x.body,read:x.read,createdAt:x.created_at})) };
  return { store, workspaces:w.data??[], clients:b.data??[], saved:(s.data??[]).map(x=>x.campaign_id), profile:p.data?.find(x=>x.auth_id===authId) };
}

export async function persistChanges(previous: Store, patch: Partial<Store>, workspaceId: string | null) {
  for (const u of patch.users ?? []) {
    const old=previous.users.find(x=>x.id===u.id);
    if (old && JSON.stringify(old)!==JSON.stringify(u)) {
      check((await supabase.from('profiles').update({name:u.name,company:u.company??null,niche:u.niche??null,location:u.location??null,bio:u.bio??null,platforms:u.platforms??[],rate:u.rate??null,followers:u.followers??null}).eq('id',u.id)).error);
    }
  }
  let createdId: number | undefined;
  for (const c of patch.campaigns ?? []) {
    const old=previous.campaigns.find(x=>x.id===c.id);
    if (!old) {
      if (!workspaceId) throw new Error('Choose a workspace first.');
      const result=await supabase.from('campaigns').insert({owner_id:c.userId,workspace_id:workspaceId,client_brand_id:c.clientBrandId??null,title:c.title,description:c.description,niche:c.niche,platform:c.platform,budget:c.budget,deliverables:c.deliverables,deadline:c.deadline,status:c.status}).select('id').single();
      check(result.error); createdId=result.data?.id;
    }
  }
  for (const a of patch.applications ?? []) {
    const old=previous.applications.find(x=>x.id===a.id);
    if (!old) check((await supabase.from('applications').insert({campaign_id:a.campaignId,creator_id:a.creatorId,pitch:a.pitch,rate:a.rate,status:'pending'})).error);
    else if(old.status!==a.status) check((await supabase.from('applications').update({status:a.status}).eq('id',a.id)).error);
  }
  for(const n of patch.notifications??[]) if(previous.notifications.find(x=>x.id===n.id)?.read!==n.read) check((await supabase.from('notifications').update({read:n.read}).eq('id',n.id)).error);
  return createdId;
}