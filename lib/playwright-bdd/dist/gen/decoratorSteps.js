"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorSteps = void 0;
const testPoms_1 = require("./testPoms");
const exit_1 = require("../utils/exit");
class DecoratorSteps {
    constructor(options) {
        this.options = options;
        this.steps = [];
        this.testPoms = new testPoms_1.TestPoms(options.testTitle);
    }
    push(partialStepInfo) {
        this.steps.push({ ...partialStepInfo, fixtureName: '' });
    }
    forEach(fn) {
        this.steps.forEach(fn);
    }
    resolveFixtureNames() {
        this.steps.forEach((step) => this.testPoms.registerPomNode(step.pomNode));
        this.options.testFixtureNames.forEach((fixtureName) => this.testPoms.registerPomNodeByFixtureName(fixtureName));
        this.options.testTags?.forEach((tag) => this.testPoms.registerPomNodeByTag(tag));
        this.testPoms.resolveFixtures();
        this.steps.forEach((step) => {
            step.fixtureName = this.getFixtureName(step);
        });
    }
    // eslint-disable-next-line visual/complexity
    getFixtureName(decoratorStep) {
        const { pomNode, pickleStep } = decoratorStep;
        const resolvedFixtures = this.testPoms.getResolvedFixtures(pomNode);
        if (resolvedFixtures.length === 0) {
            return this.exitEmptyFixture(pickleStep);
        }
        if (resolvedFixtures.length > 1) {
            if (this.options.statefulPoms) {
                return this.exitAmbiguousFixture(pickleStep, resolvedFixtures);
            }
            else {
                // tagged fixture has priority
                const firstTaggedFixture = resolvedFixtures.find((f) => f.byTag);
                const firstFixtureWithName = firstTaggedFixture?.name || pomNode.fixtureName || resolvedFixtures[0].name;
                return firstFixtureWithName || this.exitEmptyFixture(pickleStep);
            }
        }
        return resolvedFixtures[0].name;
    }
    exitEmptyFixture(pickleStep) {
        (0, exit_1.exit)(`No fixtures found for decorator step "${pickleStep.text}"`, `in "${this.options.testTitle}" (${this.options.featureUri}).`, `Please add @Fixture decorator to the class.`);
        // return string to make ts happy
        return '';
    }
    exitAmbiguousFixture(pickleStep, resolvedFixtures) {
        const possibleFixturesNames = resolvedFixtures.map((f) => f.name).join(', ');
        (0, exit_1.exit)(`Several fixtures found for decorator step "${pickleStep.text}"`, `in "${this.options.testTitle}" (${this.options.featureUri}).`, `Possible fixtures: ${possibleFixturesNames}`, `Please refactor your Page Object classes.`);
        // return string to make ts happy
        return '';
    }
}
exports.DecoratorSteps = DecoratorSteps;
//# sourceMappingURL=decoratorSteps.js.map