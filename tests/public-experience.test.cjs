const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const exportsObject={};vm.runInNewContext(ts.transpileModule(read("src/lib/public-course-choice.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {publicCourseChoice,withCourseChoice,learnerCourseDestination,publicCourseSlugs}=exportsObject;
test("course intent is strictly allowlisted and cannot redirect outside the application",()=>{
 for(const s of publicCourseSlugs){assert.equal(publicCourseChoice(s),s);assert.equal(withCourseChoice("/login?mode=inscription",s),"/login?mode=inscription&parcours="+s);assert.equal(learnerCourseDestination(s),"/espace/apprenant/formations?choix="+s+"#inscriptions");}
 for(const bad of ["https://evil.test","//evil.test","../admin","design",["ingenierie-produit-ia"],null]){assert.equal(publicCourseChoice(bad),null);assert.equal(learnerCourseDestination(bad),"/espace/apprenant");}
});
test("public landing and course choices preserve authenticated role and never auto enroll",()=>{
 const home=read("src/app/page.tsx"),auth=read("src/app/auth/actions.ts"),verify=read("src/app/auth/verify/route.ts"),space=read("src/app/espace/page.tsx"),dir=read("src/app/espace/apprenant/formations/page.tsx"),login=read("src/app/login/page.tsx");
 assert.ok(home.includes('if(user)redirect("/espace")'));assert.ok(home.includes("specializations"));assert.ok(!home.includes("enroll-free"));
 assert.ok(auth.includes("httpOnly:true"));assert.ok(auth.includes('redirect(destination("/espace"))'));assert.ok(verify.includes("request.cookies.get(publicChoiceCookie)"));assert.ok(space.includes('role==="trainer"?"/espace/formateur":learnerCourseDestination(choice)'));
 assert.ok(dir.includes("offers.some(t=>t.slug===choice)"));assert.ok(dir.includes("sortedOffers.map"));assert.ok(login.includes('name="parcours" value={choice??""}'));assert.ok(login.includes("Un compte ne constitue pas une inscription"));
});
