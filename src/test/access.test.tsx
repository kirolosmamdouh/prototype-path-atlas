import { describe, expect, it } from "vitest";
import { canAccess } from "@/lib/nav";

describe("role access", () => {
  it('only brands can manage agency workspaces',()=>{expect(canAccess('brand','/app/workspaces')).toBe(true);expect(canAccess('creator','/app/workspaces')).toBe(false);});
  it("only brands can post campaigns", () => {
    expect(canAccess("brand", "/app/campaigns/new")).toBe(true);
    expect(canAccess("creator", "/app/campaigns/new")).toBe(false);
  });
  it("only creators see their applications", () => {
    expect(canAccess("creator", "/app/applications")).toBe(true);
    expect(canAccess("brand", "/app/applications")).toBe(false);
  });
});
