/**
 * Manages map of all projects.
 * For now use name as project id (undefined is for root project).
 * See: https://github.com/microsoft/playwright/issues/29841
 */
import * as pw from '@playwright/test/reporter';
export type ProjectInfo = {
    projectName?: string;
    browserName?: string;
};
export declare const TITLE_SEPARATOR = " \u203A ";
export declare function getProjectInfo(test: pw.TestCase): ProjectInfo;
/**
 * Returns URI prepended with project name.
 * It allows to separate PW projects runs of the same feature file.
 *
 * Now result should not contain spaces as Cucumber HTML report uses it as uuid.
 * See: https://github.com/cucumber/react-components/issues/344
 */
export declare function getFeatureUriWithProject<T extends string | undefined>(projectInfo: ProjectInfo, uri: T): string | T;
export declare function getFeatureNameWithProject(projectName: ProjectInfo['projectName'], featureName: string): string;
//# sourceMappingURL=Projects.d.ts.map