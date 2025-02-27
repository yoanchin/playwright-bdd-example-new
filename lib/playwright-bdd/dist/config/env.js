"use strict";
/**
 * Storing configs in env var PLAYWRIGHT_BDD_CONFIGS as JSON-stringified values.
 * For passing configs to playwright workers and bddgen.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigDirFromEnv = getConfigDirFromEnv;
exports.saveConfigToEnv = saveConfigToEnv;
exports.getConfigFromEnv = getConfigFromEnv;
exports.getEnvConfigs = getEnvConfigs;
/*
Example of PLAYWRIGHT_BDD_CONFIGS:
{
  '/Users/foo/bar/.features-gen/one': {
    outputDir: '/Users/foo/bar/.features-gen/one',
    paths: [ 'features-one/*.feature' ],
    ...
  },
  '/Users/foo/bar/.features-gen/two': {
    outputDir: '/Users/foo/bar/.features-gen/two',
    paths: [ 'features-two/*.feature' ],
    ...
  },
}
*/
const utils_1 = require("../utils");
const exit_1 = require("../utils/exit");
// In-memory cache for all BDD configs
let envConfigsCache;
/**
 * Returns config dir for the first BDD config in env.
 */
function getConfigDirFromEnv({ throws = true } = {}) {
    const envConfigs = getEnvConfigs();
    const keys = Object.keys(envConfigs);
    if (throws && keys.length === 0) {
        (0, exit_1.exit)(`Something went wrong: no BDD configs found.`);
    }
    // Config dir is the same for all BDD configs, so use the first one.
    const firstConfig = envConfigs[keys[0]];
    const configDir = firstConfig?.configDir;
    if (throws && !configDir) {
        (0, exit_1.exit)(`Something went wrong: empty 'configDir' in: ${JSON.stringify(firstConfig)}`);
    }
    return configDir;
}
function saveConfigToEnv(config) {
    const envConfigs = getEnvConfigs();
    const configKey = getConfigKey(config.outputDir);
    const existingConfig = envConfigs[configKey];
    if (existingConfig) {
        // Playwright config can be evaluated several times in one process.
        // Throw error only if different calls of defineBddConfig() use the same outputDir.
        // See: https://github.com/vitalets/playwright-bdd/issues/39#issuecomment-1653805368
        if (!isSameConfigs(config, existingConfig)) {
            (0, exit_1.exit)(`When using several calls of defineBddConfig()`, `please manually provide different "outputDir" option for each project,`, `or use defineBddProject() helper.`);
        }
        return;
    }
    envConfigs[configKey] = config;
    saveEnvConfigs(envConfigs);
}
/**
 * Note: Playwright's project.testDir is the same as BDD outputDir.
 */
function getConfigFromEnv(absOutputDir) {
    const configKey = getConfigKey(absOutputDir);
    const envConfigs = getEnvConfigs();
    return envConfigs[configKey];
}
function getEnvConfigs() {
    if (!envConfigsCache) {
        envConfigsCache = JSON.parse(process.env.PLAYWRIGHT_BDD_CONFIGS || '{}');
    }
    return envConfigsCache;
}
function getConfigKey(outputDir) {
    return (0, utils_1.trimTrailingSlash)(outputDir);
}
function saveEnvConfigs(envConfigs) {
    envConfigsCache = envConfigs;
    process.env.PLAYWRIGHT_BDD_CONFIGS = JSON.stringify(envConfigs);
}
function isSameConfigs(config1, config2) {
    return JSON.stringify(config1) === JSON.stringify(config2);
}
//# sourceMappingURL=env.js.map