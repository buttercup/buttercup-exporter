const csvStringify = require("csv-stringify");
const pify = require("pify");
const { createEntryFacade, init } = require("buttercup");

const SYSTEM_HEADINGS = ["!group_id", "!group_name", "!group_parent"];

function exportVaultToCSV(vault) {
    const data = exportVaultToCSVTable(vault);
    return pify(csvStringify)(data);
}

function exportVaultToCSVTable(vault) {
    // Init Buttercup
    init();
    const groups = [];
    const entries = [];
    const usedKeys = [];
    const csvTable = [];
    // Extract JSON object representations of all entries
    const rootGroups = vault.getGroups();
    rootGroups
        .map(group => extractGroupEntries(group))
        .forEach(extractedEntries => {
            entries.push(...extractedEntries);
        });
    rootGroups
        .map(group => extractGroups(group))
        .forEach(extractedGroups => {
            groups.push(...extractedGroups);
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
    const tableHeadings = [...SYSTEM_HEADINGS, ...usedKeys.filter(prop => SYSTEM_HEADINGS.includes(prop) === false)];
    csvTable.push([
        "!type",
        ...tableHeadings
    ]);
    // Add all groups
    groups.forEach(group => {
        csvTable.push([
            "group",
            ...tableHeadings.map(headingKey => group[headingKey] || "")
        ]);
    });
    // Add all entries
    entries.forEach(entry => {
        csvTable.push([
            "entry",
            ...tableHeadings.map(headingKey => entry[headingKey] || "")
        ]);
    });
    return csvTable;
}

function extractGroups(group) {
    const parent = group.getParentGroup();
    return [
        {
            "!group_id": group.id,
            "!group_name": group.getTitle(),
            "!group_parent": parent && parent.id || "0",
        },
        ...group.getGroups().map(sub => extractGroups(sub)).reduce((output, result) => [
            ...output,
            ...result
        ], [])
    ];
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
            "!group_name": "",
            "!group_parent": "",
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
