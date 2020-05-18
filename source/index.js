const csvStringify = require("csv-stringify");
const pify = require("pify");
const { createEntryFacade, init } = require("buttercup");

function exportVaultToCSV(vault) {
    const data = exportVaultToCSVTable(vault);
    return pify(csvStringify)(data);
}

function exportVaultToCSVTable(vault) {
    // Init Buttercup
    init();
    const entries = [];
    const usedKeys = [];
    const csvTable = [];
    // Extract JSON object representations of all entries
    vault
        .getGroups()
        .map(group => extractGroupEntries(group))
        .forEach(extractedEntries => {
            entries.push(...extractedEntries);
        });
    // Record every used key
    entries.forEach(entry => {
        Object.keys(entry).forEach(entryKey => {
            if (usedKeys.indexOf(entryKey) === -1) {
                usedKeys.push(entryKey);
            }
        });
    });
    // Create table header
    const tableHeadings = ["!group_id", "!group_name", ...usedKeys];
    csvTable.push(tableHeadings);
    // Add all entries
    entries.forEach(entry => {
        csvTable.push(tableHeadings.map(headingKey => entry[headingKey] || ""));
    });
    return csvTable;
}

function extractGroupEntries(group) {
    const items = group.getEntries().map(entry => {
        const props = createEntryFacade(entry).fields.reduce((output, field) => {
            if (field.propertyType === "property") {
                output[field.property] = field.value;
            }
            return output;
        }, {});
        return Object.assign({}, props, {
            "!group_id": group.id,
            "!group_name": group.getTitle(),
            id: entry.id
        });
    });
    group.getGroups().forEach(subGroup => {
        items.push(...extractGroupEntries(subGroup));
    });
    return items;
}

module.exports = {
    exportVaultToCSV,
    exportVaultToCSVTable
};
