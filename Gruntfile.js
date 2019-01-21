// This is a testing playground for our lint rules.

  // 1. Run yarn && yarn start
 // 2. "File > Add Folder to Workspace" this specific folder in VSCode with ESLint extension
 // 3. Changes to the rule source should get picked up without restarting ESLint server

  function Foo() {
   if (condition) {
     useEffect(() => {});
   }
 }
View file   
12  fixtures/eslint/package.json
@@ -0,0 +1,12 @@
 {
   "private": true,
   "name": "eslint-playground",
   "dependencies": {
     "eslint": "4.1.0",
     "eslint-plugin-react-hooks": "link:./proxy"
   },
   "scripts": {
     "start": "./watch.sh",
     "lint": "eslint index.js"
   }
 }
View file   
35  fixtures/eslint/proxy/index.js
@@ -0,0 +1,35 @@
 'use strict';

  // This file is a proxy for our rule definition that will
 // load the latest built version on every check. This makes
 // it convenient to test inside IDEs (which would otherwise
 // load a version of our rule once and never restart the server).
 // See instructions in ../index.js playground.

  let build;
 reload();

  function reload() {
   for (let id in require.cache) {
     if (/eslint-plugin-react-hooks/.test(id)) {
       delete require.cache[id];
     }
   }
   // Point to the built version.
   build = require('../../../build/node_modules/eslint-plugin-react-hooks');
 }

  let rules = {};
 for (let key in build.rules) {
   if (build.rules.hasOwnProperty(key)) {
     rules[key] = Object.assign({}, build.rules, {
       create() {
         // Reload changes to the built rule
         reload();
         return build.rules[key].create.apply(this, arguments);
       },
     });
   }
 }

  module.exports = {rules};
