"""Live Cloud authorization regression checks. Requires server test credentials.
Creates temporary accounts, exercises RLS, and removes only its own accounts.
Run: python3 src/test/phase1.integration.py
"""
import os, secrets, requests

base = os.environ['SUPABASE_URL']
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
admin = {'apikey': key, 'Authorization': 'Bearer ' + key}
created = []

def account(role):
    email = 'authorization-' + secrets.token_hex(8) + '@example.com'
    password = secrets.token_urlsafe(24)
    result = requests.post(base + '/auth/v1/admin/users', headers=admin,
        json={'email': email, 'password': password, 'email_confirm': True}, timeout=30)
    assert result.ok, 'account trigger failed'
    uid = result.json()['id']; created.append(uid)
    login = requests.post(base + '/auth/v1/token?grant_type=password', headers={'apikey':key},
        json={'email':email,'password':password}, timeout=30)
    assert login.ok, 'account sign-in failed'
    headers = {'apikey': key, 'Authorization': 'Bearer ' + login.json()['access_token'], 'Prefer':'return=representation'}
    result = requests.post(base + '/rest/v1/rpc/complete_onboarding', headers=headers,
        json={'account_role':role,'display_name':'Authorization test','workspace_name':'Agency test','is_agency':True},timeout=30)
    assert result.ok, 'onboarding failed'
    pid = requests.post(base + '/rest/v1/rpc/my_profile_id',headers=headers,json={},timeout=30).json()
    return headers, pid

try:
    brand, brand_id = account('brand'); creator, creator_id = account('creator')
    workspace = requests.get(base+'/rest/v1/workspaces?select=id',headers=brand,timeout=30).json()[0]['id']
    assert requests.get(base+'/rest/v1/workspaces?select=id',headers=creator,timeout=30).json() == [], 'creator read private workspace'
    bad = requests.post(base+'/rest/v1/rpc/complete_onboarding',headers=creator,json={'account_role':'brand','display_name':'Changed','workspace_name':'Unauthorized'},timeout=30)
    assert not bad.ok, 'role could be reassigned'
    bad = requests.patch(base+f'/rest/v1/profiles?id=eq.{creator_id}',headers=creator,json={'verified':True},timeout=30)
    assert not bad.ok, 'creator self-verified'
    bad = requests.get(base+'/rest/v1/profiles?select=auth_id',headers=creator,timeout=30)
    assert not bad.ok, 'private auth identity exposed'
    payload={'owner_id':brand_id,'workspace_id':workspace,'title':'Private draft','description':'Private','niche':'Beauty','platform':'TikTok','budget':4500,'deliverables':'2 videos','deadline':'2026-12-20T00:00:00Z','status':'draft'}
    result=requests.post(base+'/rest/v1/campaigns',headers=brand,json=payload,timeout=30)
    assert result.ok, 'brand campaign creation failed'
    cid=result.json()[0]['id']
    assert requests.get(base+f'/rest/v1/campaigns?id=eq.{cid}',headers=creator,timeout=30).json()==[], 'private draft exposed'
    result=requests.patch(base+f'/rest/v1/campaigns?id=eq.{cid}',headers=brand,json={'status':'open'},timeout=30)
    assert result.ok, 'campaign publish failed'
    proposal={'campaign_id':cid,'creator_id':creator_id,'pitch':'Valid application','rate':4000}
    result=requests.post(base+'/rest/v1/applications',headers=creator,json=proposal,timeout=30)
    assert result.ok, 'creator could not apply'
    aid=result.json()[0]['id']
    assert not requests.post(base+'/rest/v1/applications',headers=creator,json=proposal,timeout=30).ok, 'duplicate application accepted'
    assert requests.patch(base+f'/rest/v1/applications?id=eq.{aid}',headers=creator,json={'status':'accepted'},timeout=30).json()==[], 'creator decided own application'
    assert requests.patch(base+f'/rest/v1/applications?id=eq.{aid}',headers=brand,json={'status':'accepted'},timeout=30).ok, 'brand could not decide application'
    assert len(requests.get(base+'/rest/v1/notifications',headers=creator,timeout=30).json())==1, 'creator notification missing'
    assert not requests.post(base+'/rest/v1/client_brands',headers=creator,json={'workspace_id':workspace,'name':'Unauthorized'},timeout=30).ok, 'creator changed agency workspace'
    print('Live account isolation: 11 concrete authorization and persistence checks passed.')
finally:
    # Cleanup uses only test-owned rows; no application account is selected implicitly.
    for uid in created:
        profiles=requests.get(base+f'/rest/v1/profiles?auth_id=eq.{uid}&select=id',headers=admin,timeout=30).json()
        if not profiles: continue
        pid=profiles[0]['id']
        for table,column in [('notifications','user_id'),('applications','creator_id')]:
            requests.delete(base+f'/rest/v1/{table}?{column}=eq.{pid}',headers=admin,timeout=30)
        campaigns=requests.get(base+f'/rest/v1/campaigns?owner_id=eq.{pid}&select=id',headers=admin,timeout=30).json()
        for c in campaigns:
            requests.delete(base+f'/rest/v1/applications?campaign_id=eq.{c["id"]}',headers=admin,timeout=30)
            requests.delete(base+f'/rest/v1/campaigns?id=eq.{c["id"]}',headers=admin,timeout=30)
        requests.delete(base+f'/rest/v1/workspaces?owner_id=eq.{pid}',headers=admin,timeout=30)
        requests.delete(base+'/auth/v1/admin/users/'+uid,headers=admin,timeout=30)