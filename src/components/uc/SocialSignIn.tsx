import { Button } from '@/components/ui/button';
import { lovable } from '@/integrations/lovable';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import '@lovable.dev/cloud-auth-js/styles.css';

export function SocialSignIn() {
  const {t}=useI18n(); const navigate=useNavigate();
  const signIn=async(provider:'google'|'lovable')=>{
    const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:window.location.origin});
    if(result.error){toast.error(t('Sign-in failed. Please try again.'));return;}
    if(!result.redirected)await navigate({to:'/app'});
  };
  return <div className="mt-5 grid gap-3"><Button variant="outline" onClick={()=>void signIn('google')}>{t('Continue with Google')}</Button><Button className="lovable-auth-button" onClick={()=>void signIn('lovable')}>{t('Continue with Lovable')}</Button></div>;
}