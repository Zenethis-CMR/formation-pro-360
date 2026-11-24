const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("shared sidebars reserve enough space while keeping the main grid flexible",()=>{
 const css=read("src/app/espace/workspace-sidebars.css"),layout=read("src/app/espace/layout.tsx");
 assert.ok(layout.includes('import "./workspace-sidebars.css"'));
 assert.ok(css.includes("--workspace-nav-width:265px;--workspace-rail-width:325px"));
 assert.ok(css.includes("--workspace-nav-width:245px;--workspace-rail-width:300px"));
 assert.ok(css.includes("grid-template-columns:var(--workspace-nav-width) minmax(0,1fr) var(--workspace-rail-width)"));
 assert.ok(css.includes(".secure-academy-frame.workspace-learner-shell"));
 assert.ok(css.includes(".secure-academy-frame.secure-academy-detail"));
 assert.ok(css.includes("@media(max-width:820px)"));
});
test("navigation pending indicator does not compete with text and profile labels can wrap",()=>{
 const css=read("src/app/espace/workspace-sidebars.css");
 assert.ok(css.includes(".sidebar-link>span:not(.ux-link-indicator)"));
 assert.ok(css.includes(".sidebar-link>.ux-link-indicator[data-pending=false]{display:none}"));
 assert.match(css,/\.sidebar-link>\.ux-link-indicator\{\s*position:absolute/);
 assert.match(css,/\.workspace-profile-stat>span\{\s*display:block;max-width:100%;white-space:normal;overflow-wrap:anywhere/);
 assert.ok(css.includes("repeat(3,minmax(0,1fr))"));
});
