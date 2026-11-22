const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = p => fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("Next.js fetches only the application session cookie", () => {
  const src=read("src/lib/auth/backend.ts");
  assert.match(src,/\.get\(sessionCookie\)/);
  assert.doesNotMatch(src,/cookieStore\.getAll\(/);
  assert.match(src,/name !== sessionCookie/);
});
test("server rendering reuses one context across identity, token and role checks", () => {
  const auth=read("src/lib/auth/backend.ts");
  const role=read("src/lib/auth/require-role.ts");
  assert.match(auth,/cache\(async/);
  assert.match(auth,/\/v1\/auth\/session-context/);
  assert.match(auth,/response\?\.status !== 404/);
  assert.match(auth,/\/v1\/auth\/me/);
  assert.match(auth,/\/v1\/auth\/token/);
  assert.match(role,/cache\(async/);
  assert.match(role,/\.from\("profiles"\)/);
  assert.match(role,/expected && context\.role !== expected/);
});
test("middleware redirects missing cookies but never serves protected data itself", () => {
  const src=read("src/lib/auth/middleware.ts");
  assert.match(src,/request\.cookies\.get\("fp360_session"\)/);
  assert.match(src,/NextResponse\.redirect\(new URL\("\/login"/);
  assert.doesNotMatch(src,/fetch\(/);
  const layout=read("src/app/espace/layout.tsx");
  assert.match(layout,/requireRole\(/);
});
test("account password change requires old password on both sides of the form", () => {
  const actions=read("src/app/auth/actions.ts");
  const account=read("src/app/espace/compte/page.tsx");
  assert.match(actions,/formData\.get\("currentPassword"\)/);
  assert.match(actions,/currentPassword,password/);
  assert.match(actions,/if\(!token\)/);
  assert.match(actions,/await requireRole\(\)/);
  assert.match(account,/name="currentPassword"/);
  assert.match(account,/autoComplete="current-password"/);
  assert.match(account,/mode=recuperation/);
});
test("token recovery remains separate and cannot silently sign in a user", () => {
  const reset=read("src/app/auth/nouveau-mot-de-passe/page.tsx");
  const action=read("src/app/auth/actions.ts");
  assert.match(reset,/name="token"/);
  assert.match(reset,/href="\/login"/);
  assert.match(action,/token\?\{token,password\}:\{currentPassword,password\}/);
});
