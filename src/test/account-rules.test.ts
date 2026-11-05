import { describe,it,expect } from 'vitest';
import { validOnboarding,sameWorkspace } from '@/lib/account-rules';
import { personalizedCreators } from '@/lib/match';
import { SEED } from '@/lib/seed';
describe('marketplace account rules',()=>{
  it('brand setup requires a named workspace',()=>{expect(validOnboarding('brand','Nile','')).toBe(false);expect(validOnboarding('brand','Nile','Agency')).toBe(true);});
  it('creator setup does not require a brand workspace',()=>{expect(validOnboarding('creator','Salma','')).toBe(true);});
  it('only brand and creator can self-register',()=>{expect(validOnboarding('admin','Name','Workspace')).toBe(false);});
  it('campaign client brands must belong to the same workspace',()=>{expect(sameWorkspace('agency-a','agency-b')).toBe(false);expect(sameWorkspace('agency-a','agency-a')).toBe(true);});
  it('workspace members get recommendations for colleague campaigns',()=>{const scoped={...SEED,campaigns:SEED.campaigns.filter(c=>c.userId===4)};expect(personalizedCreators(1,scoped,8,true).length).toBeGreaterThan(0);expect(personalizedCreators(1,scoped).length).toBe(0);});
});