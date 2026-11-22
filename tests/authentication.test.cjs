const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const ts=require("typescript");
const src=fs.readFileSync(path.join(__dirname,"..","src","lib","auth","validation.ts"),"utf8");
const code=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod={exports:{}};
vm.runInNewContext(code,{module:mod,exports:mod.exports,require});
const {isValidEmail,isValidPassword}=mod.exports;

test("known valid email address format accepted",()=>{
  assert.equal(isValidEmail("learner@example.com"),true);
  assert.equal(isValidEmail("foo.bar+test@example.co.uk"),true);
});
test("invalid, malformed and excessive email addresses rejected",()=>{
  for(const value of ["","a","a@","@example.com","a@x","a b@example.com","x".repeat(255)+"@a.com"]){
    assert.equal(isValidEmail(value),false,value);
  }
});
test("new password requires at least ten characters including upper, lower, digit",()=>{
  assert.equal(isValidPassword("Formation2026"),true);
  for(const password of ["short1A","alllowercase123","ALLUPPERCASE123","NoDigitsHere","aA1"]){
    assert.equal(isValidPassword(password),false,password);
  }
});
test("password length maximum does not allow oversized requests",()=>{
  assert.equal(isValidPassword("ValidPassword1"+"x".repeat(130)),false);
});
test("sign-in, registration and password recovery use the Node authentication API",()=>{
  const actions=fs.readFileSync(path.join(__dirname,"..","src","app","auth","actions.ts"),"utf8");
  assert.match(actions,/signInWithPassword/);
  assert.match(actions,/\/register/);
  assert.match(actions,/\/request-password-reset/);
  assert.match(actions,/\/login/);
  assert.doesNotMatch(actions,/deleteUser\(/);
});
