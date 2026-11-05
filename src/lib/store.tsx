import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useI18n } from './i18n';
import { EMPTY_STORE, check, loadMarketplace, persistChanges, type Workspace, type ClientBrand } from './cloud-store';
import type { Role, Store, User } from './types';

interface Ctx {
  ready:boolean; signedIn:boolean; store:Store; user:User|null; error:string|null;
  workspaces:Workspace[]; clients:ClientBrand[]; workspaceId:string|null; saved:number[];
  selectWorkspace:(id:string)=>void; refresh:()=>Promise<void>;
  update:(fn:(s:Store)=>Partial<Store>)=>Promise<{ok:boolean;createdId?:number}>;
  toggleSave:(id:number)=>Promise<void>;
  login:(email:string,password:string)=>Promise<string|null>;
  register:(data:{name:string;email:string;password:string;role:Role})=>Promise<string|null>;
  logout:()=>Promise<void>;
}
const StoreContext=createContext<Ctx|null>(null);
export function StoreProvider({children}:{children:ReactNode}) {
  const queryClient=useQueryClient();
  const {t}=useI18n();
  const [store,setStore]=useState<Store>(EMPTY_STORE);
  const [ready,setReady]=useState(false),[signedIn,setSignedIn]=useState(false),[error,setError]=useState<string|null>(null);
  const [authId,setAuthId]=useState<string|null>(null);
  const [workspaces,setWorkspaces]=useState<Workspace[]>([]),[clients,setClients]=useState<ClientBrand[]>([]);
  const [workspaceId,setWorkspaceId]=useState<string|null>(null),[saved,setSaved]=useState<number[]>([]);
  const generation=useRef(0);
  const refresh=useCallback(async()=>{
    const run=++generation.current;
    const {data,error:authError}=await supabase.auth.getUser();
    if(run!==generation.current)return;
    if(authError||!data.user){setStore(EMPTY_STORE);setAuthId(null);setSignedIn(false);setWorkspaces([]);setClients([]);setSaved([]);setWorkspaceId(null);setReady(true);return;}
    setSignedIn(true);setAuthId(data.user.id);
    try {
      const result=await loadMarketplace(data.user.email??'',data.user.id);
      if(run!==generation.current)return;
      setStore(result.store);setWorkspaces(result.workspaces);setClients(result.clients);setSaved(result.saved);
      setWorkspaceId(old=>result.workspaces.some(w=>w.id===old)?old:result.workspaces[0]?.id??null);setError(null);
    }catch(e){if(run===generation.current){setStore(EMPTY_STORE);setError(e instanceof Error?e.message:'Unable to load your account.');}}
    finally {if(run===generation.current)setReady(true);}
  },[]);
  useEffect(()=>{
    localStorage.removeItem('uc_store_v1');localStorage.removeItem('uc_session');localStorage.removeItem('uc-saved-campaigns');
    void refresh();
    const {data}=supabase.auth.onAuthStateChange(event=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED','PASSWORD_RECOVERY'].includes(event)) {setReady(false);setStore(EMPTY_STORE);void refresh();}});
    return()=>{data.subscription.unsubscribe();generation.current++;};
  },[refresh]);
  const user=store.users.find(u=>u.authId===authId)??null;
  const update:Ctx['update']=async fn=>{try{const createdId=await persistChanges(store,fn(store),workspaceId);await refresh();return{ok:true,createdId};}catch(e){toast.error(t('Changes could not be saved.'));console.error(e);return{ok:false};}};
  const login:Ctx['login']=async(email,password)=>{const result=await supabase.auth.signInWithPassword({email:email.trim(),password});if(result.error)return result.error.message;await refresh();return null;};
  const register:Ctx['register']=async data=>{const result=await supabase.auth.signUp({email:data.email.trim(),password:data.password,options:{emailRedirectTo:window.location.origin,data:{name:data.name}}});if(result.error)return result.error.message;await refresh();return null;};
  const logout=async()=>{await queryClient.cancelQueries();queryClient.clear();check((await supabase.auth.signOut()).error);generation.current++;setStore(EMPTY_STORE);setAuthId(null);setSignedIn(false);setWorkspaces([]);setClients([]);setSaved([]);setWorkspaceId(null);setReady(true);};
  const toggleSave=async(id:number)=>{if(!user)return;try{if(saved.includes(id))check((await supabase.from('saved_campaigns').delete().eq('user_id',user.id).eq('campaign_id',id)).error);else check((await supabase.from('saved_campaigns').insert({user_id:user.id,campaign_id:id})).error);await refresh();}catch{toast.error(t('Changes could not be saved.'));}};
  // Brand campaigns are isolated to the selected workspace; creators browse all visible campaigns.
  const visibleStore=user?.role==='brand'?{...store,campaigns:store.campaigns.filter(c=>c.workspaceId===workspaceId)}:store;
  return <StoreContext.Provider value={{ready,signedIn,store:visibleStore,user,error,workspaces,clients,workspaceId,saved,selectWorkspace:setWorkspaceId,refresh,update,toggleSave,login,register,logout}}>{children}</StoreContext.Provider>;
}
export function useApp(){const ctx=useContext(StoreContext);if(!ctx)throw new Error('useApp must be used inside StoreProvider');return ctx;}
export const fmt=(n:number)=>new Intl.NumberFormat('en-EG',{maximumFractionDigits:0}).format(n);
export const fmtDate=(d:string)=>new Date(d).toLocaleDateString('en-EG',{month:'short',day:'numeric',year:'numeric'});
export const ago=(d:string)=>{const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<1)return'just now';if(m<60)return`${m}m ago`;const h=Math.floor(m/60);return h<24?`${h}h ago`:`${Math.floor(h/24)}d ago`;};