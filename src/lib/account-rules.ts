import type { Role } from './types';

export function validOnboarding(role: string, name: string, workspace: string): role is Role {
  return (role === 'brand' || role === 'creator') && name.trim().length > 0 && (role !== 'brand' || workspace.trim().length > 0);
}

export function sameWorkspace(clientWorkspace: string, campaignWorkspace: string) {
  return clientWorkspace === campaignWorkspace;
}