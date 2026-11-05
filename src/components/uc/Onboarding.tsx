import { useState } from 'react';
import { Building2, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field,inputCls } from './ui';
import { useApp } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { validOnboarding } from '@/lib/account-rules';
import type { Role } from '@/lib/types';

export function Onboarding(){
  const {refresh,logout}=useApp();const {t}=useI18n();
  const [role,setRole]=useState<Role>('creator'),[name,setName]=useState(''),[workspace,setWorkspace]=useState(''),[agency,setAgency]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  return <main className="mx-auto max-w-xl px-6 py-16"><h1 className="text-3xl font-bold">{t('Set up your workspace')}</h1><div className="my-6 grid grid-cols-2 gap-3"><Button variant={role==='creator'?'default':'outline'} onClick={()=>setRole('creator')}><Clapperboard/>{t('Creator')}</Button><Button variant={role==='brand'?'default':'outline'} onClick={()=>setRole('brand')}><Building2/>{t('Brand / Agency')}</Button></div><form className="space-y-5" onSubmit={async e=>{e.preventDefault();if(!validOnboarding(role,name,workspace))return;setBusy(true);const result=await supabase.rpc('complete_onboarding',{account_role:role,display_name:name,workspace_name:workspace,is_agency:agency});if(result.error)setError(result.error.message);else await refresh();setBusy(false);}}><Field label="Full name"><input required className={inputCls} value={name} onChange={e=>setName(e.target.value)}/></Field>{role==='brand'&&<><Field label="Workspace name"><input required className={inputCls} value={workspace} onChange={e=>setWorkspace(e.target.value)}/></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={agency} onChange={e=>setAgency(e.target.checked)}/>{t('Agency managing multiple brands')}</label></>}{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={busy}>{t(busy?'Loading…':'Finish setup')}</Button><Button type="button" variant="ghost" onClick={()=>void logout()}>{t('Log out')}</Button></form></main>;
}