import { describe,it,expect } from 'vitest';
import { validOnboarding,sameWorkspace } from '@/lib/account-rules';
describe('marketplace account rules',()=>{
  it('brand setup requires a named workspace',()=>{expect(validOnboarding('brand','Nile','')).toBe(false);expect(validOnboarding('brand','Nile','Agency')).toBe(true);});
  it('creator setup does not require a brand workspace',()=>{expect(validOnboarding('creator','Salma','')).toBe(true);});
  it('only brand and creator can self-register',()=>{expect(validOnboarding('admin','Name','Workspace')).toBe(false);});
  it('campaign client brands must belong to the same workspace',()=>{expect(sameWorkspace('agency-a','agency-b')).toBe(false);expect(sameWorkspace('agency-a','agency-a')).toBe(true);});
});