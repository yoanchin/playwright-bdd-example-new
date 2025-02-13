// Generated from: features/scenario-outline-excel-json-background.feature
import { test } from "../../steps/fixtures.ts";

test.describe('scenario-outline', () => {

  test.beforeEach('Background', async ({ Given }) => {
    await Given('TestCase \'testCase1\''); 
  });
  
  test.describe('Check doubled1', () => {

    test('Example #1', async ({ Given, Then }) => { 
      await Given('State 2'); 
      await Then('Doubled 2 equals 4'); 
    });

    test('Example #2', async ({ Given, Then }) => { 
      await Given('State 3'); 
      await Then('Doubled 3 equals 6'); 
    });

    test('Example #3', async ({ Given, Then }) => { 
      await Given('State 4'); 
      await Then('Doubled 4 equals 8'); 
    });

  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/scenario-outline-excel-json-background.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","isBg":true,"stepMatchArguments":[{"group":{"start":9,"value":"'testCase1'","children":[{"children":[{"children":[]}]},{"start":10,"value":"testCase1","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":7,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":8,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"4","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":17,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","isBg":true,"stepMatchArguments":[{"group":{"start":9,"value":"'testCase2'","children":[{"children":[{"children":[]}]},{"start":10,"value":"testCase2","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":7,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"3","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":19,"gherkinStepLine":8,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"3","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"6","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":22,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","isBg":true,"stepMatchArguments":[{"group":{"start":9,"value":"'testCase3'","children":[{"children":[{"children":[]}]},{"start":10,"value":"testCase3","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":7,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"4","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":24,"gherkinStepLine":8,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"4","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"8","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end