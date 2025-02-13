// Generated from: features/homepage.feature
import { test } from "../../steps/fixtures.ts";

test.describe('Playwright Home Page', () => {

  test.describe('Check title', () => {

    test('MYT-2 | Example #1', async ({ Given, page, When, Then }) => { 
      await Given('I am on Playwright home page', null, { page }); 
      await When('I click link \'Get started\'', null, { page }); 
      await Then('I see in title \'Installation\'', null, { page }); 
    });

    test('MYT-2 | Example #2', async ({ Given, page, When, Then }) => { 
      await Given('I am on Playwright home page', null, { page }); 
      await When('I click link \'Get started\'', null, { page }); 
      await Then('I see in title \'Installation\'', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/homepage.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":3,"tags":["@MYT-2"],"steps":[{"pwStepLine":9,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":5,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[{"group":{"start":13,"value":"'Get started'","children":[{"children":[{"children":[]}]},{"start":14,"value":"Get started","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":6,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":15,"value":"'Installation'","children":[{"children":[{"children":[]}]},{"start":16,"value":"Installation","children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":7,"tags":["@MYT-2"],"steps":[{"pwStepLine":15,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":5,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[{"group":{"start":13,"value":"'Get started'","children":[{"children":[{"children":[]}]},{"start":14,"value":"Get started","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":6,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":15,"value":"'Installation'","children":[{"children":[{"children":[]}]},{"start":16,"value":"Installation","children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end