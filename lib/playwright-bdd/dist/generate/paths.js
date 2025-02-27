"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecFileByFeatureFile = getSpecFileByFeatureFile;
/**
 * Mapping: feature uri <-> spec file.
 */
const node_path_1 = __importDefault(require("node:path"));
const exit_1 = require("../utils/exit");
/**
 * Returns path to spec file by feature file.
 */
function getSpecFileByFeatureFile(config, relFeatureFile) {
    const absFeatureFile = node_path_1.default.resolve(config.configDir, relFeatureFile);
    const relSpecFile = node_path_1.default.relative(config.featuresRoot, absFeatureFile) + '.spec.js';
    if (relSpecFile.startsWith('..')) {
        (0, exit_1.exit)(`All feature files should be located underneath featuresRoot.`, `Please change featuresRoot or paths in configuration.\n`, `featureFile: ${absFeatureFile}\n`, `featuresRoot: ${config.featuresRoot}\n`);
    }
    const absSpecFile = node_path_1.default.resolve(config.outputDir, relSpecFile);
    return absSpecFile;
}
/**
 * Returns relative path to feature file by spec file.
 */
// commented, possibly we don't need this fn as we get feature uri from spec file itself
// export function getFeatureFileBySpecFile(config: BDDConfig, absSpecFile: string) {
//   const relSpecFile = path.relative(config.outputDir, absSpecFile);
//   const absFeatureFile = path.join(config.featuresRoot, relSpecFile).replace(/\.spec\.js$/, '');
//   const relFeatureFile = path.relative(config.configDir, absFeatureFile);
//   return relFeatureFile;
// }
//# sourceMappingURL=paths.js.map