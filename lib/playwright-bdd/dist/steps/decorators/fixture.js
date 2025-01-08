"use strict";
/**
 * Class level @Fixture decorator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixture = void 0;
const pomGraph_1 = require("./pomGraph");
function Fixture(fixtureName) {
    // context parameter is required for decorator by TS even though it's not used
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return (Ctor, _context) => {
        (0, pomGraph_1.createPomNode)(Ctor, fixtureName);
    };
}
exports.Fixture = Fixture;
//# sourceMappingURL=fixture.js.map