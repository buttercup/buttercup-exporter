const csvStringify = require("csv-stringify");
const pify = require("pify");

function exportArchiveToCSV(archive) {
    const data = exportArchiveToCSVTable(archive);
    return pify(csvStringify)(data);
}

function exportArchiveToCSVTable(archive) {
    const entries = [];
    const usedKeys = [];
    const csvTable = [];
    // Extract JSON object representations of all entries
    archive.getGroups()
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
    const items = group.getEntries().map(entry => Object.assign(
        {},
        entry.toObject().properties,
        {
            "!group_id": group.id,
            "!group_name": group.getTitle(),
            id: entry.id
        }
    ));
    group.getGroups().forEach(subGroup => {
        items.push(...extractGroupEntries(subGroup));
    });
    return items;
}

module.exports = {
    exportArchiveToCSV,
    exportArchiveToCSVTable
};
