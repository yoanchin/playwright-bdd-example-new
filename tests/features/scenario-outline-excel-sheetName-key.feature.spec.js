// Generated from: features/scenario-outline-excel-sheetName-key.feature
import { test } from "../../steps/fixtures.ts";

test.describe('scenario-outline', () => {

  test.describe('Check doubled', () => {

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
  $uri: ({}, use) => use('features/scenario-outline-excel-sheetName-key.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":9,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":10,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"4","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":13,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"3","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"3","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"6","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":18,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":19,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[{"group":{"start":6,"value":"4","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":20,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":8,"value":"4","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"8","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end