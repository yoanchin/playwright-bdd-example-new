"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GherkinDocumentUtil = void 0;
const messages_1 = require("@cucumber/messages");
class GherkinDocumentUtil {
    static getUriFromGherkinDocument(gherkinDocument) {
        return gherkinDocument.uri;
    }
    static getNameFromScenario(scenario) {
        return scenario.name;
    }
    static genPickle(uri, name, language, astNodeIdsForSteps, types, text, tagNames, astNodeIds, ids) {
        return {
            id: messages_1.IdGenerator.uuid()(),
            uri: uri, //source.uri
            name: name, //scenario.name
            language: language,
            steps: this.genPickleSteps(astNodeIdsForSteps, types, text), // tablebody ids and step ids
            tags: this.genPickleTags(tagNames, astNodeIds), // feature tags and scenario tags
            astNodeIds: this.genAstNodeIds(ids) // scenario id and step id
        };
    }
    static genPickleTags(tagNames, astNodeIds) {
        let pickleTags = [];
        for (let i = 0; i < tagNames.length; i++) {
            pickleTags.push({ name: tagNames[i], astNodeId: astNodeIds[i] });
        }
        return pickleTags;
    }
    static genPickleSteps(astNodeIds, types, texts) {
        let pickleSteps = [];
        for (let i = 0; i < astNodeIds.length; i++) {
            pickleSteps.push(this.genPickleStep(astNodeIds[i], types[i], texts[i]));
        }
        return pickleSteps;
    }
    //The context in which the step was specified: context (Given), action (When) or outcome (Then).
    // \n\nNote that the keywords `But` and `And` inherit their meaning from prior steps and 
    // the `*` 'keyword' doesn't have specific meaning (hence Unknown)
    //export declare enum PickleStepType {
    //    UNKNOWN = "Unknown",
    //    CONTEXT = "Context",//Given
    //    ACTION = "Action",//When
    //    OUTCOME = "Outcome"//Then
    //}
    static genPickleStep(astNodeIds, type, text) {
        return {
            astNodeIds: astNodeIds,
            id: messages_1.IdGenerator.uuid()(),
            type: type,
            text: text
        };
    }
    static genAstNodeIds(ids) {
        return ids;
    }
    static genTableHeader(values, lineforCells, lineforHeader) {
        return this.genTableRow(values, lineforCells, lineforHeader);
    }
    static genTableBody(values, lineforCells, lineforHeader) {
        let rows = [];
        for (let i = 0; i < values.length; i++) {
            rows.push(this.genTableRow(values[i], lineforCells[i], lineforHeader[i]));
        }
        return rows;
    }
    static genTableRow(values, lineforCells, lineforHeader) {
        return {
            id: messages_1.IdGenerator.uuid()(),
            location: this.genLocation(lineforHeader),
            cells: this.genTableCells(values, lineforCells)
        };
    }
    static genTableCells(value, line) {
        let cells = [];
        for (let i = 0; i < value.length; i++) {
            cells.push(this.genTableCell(value[i], line[i]));
        }
        return cells;
    }
    static genTableCell(value, line) {
        return {
            location: this.genLocation(line),
            value: value
        };
    }
    static genLocation(line) {
        return {
            line: line,
            column: line
        };
    }
}
exports.GherkinDocumentUtil = GherkinDocumentUtil;
//# sourceMappingURL=gherkinDocumentUtil.js.map