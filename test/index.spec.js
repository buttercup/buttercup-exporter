const { Archive } = require("buttercup");
const csvjson = require("csvjson");
const { exportArchiveToCSV, exportArchiveToCSVTable } = require("../source/index.js");

const UUID_REXP = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

function setup() {
    const archive = (this.archive = new Archive());
    const mailGroup = archive.createGroup("Mail");
    mailGroup
        .createEntry("Hotmail")
        .setProperty("username", "test@hotmail.com")
        .setProperty("password", "abc123")
        .setProperty("URL", "https://login.live.com")
        .setProperty("Secret", "value");
    mailGroup
        .createEntry("Yahoo")
        .setProperty("username", "test@yahoo.com")
        .setProperty("password", "123abc")
        .setProperty("Pin", "1234");
    mailGroup
        .createGroup("General")
        .createEntry("Home PC")
        .setProperty("username", "test")
        .setProperty("password", "passw0rd");
}

describe("exportArchiveToCSV", function() {
    beforeEach(function() {
        setup.call(this);
    });

    it("contains the correct number of lines", function() {
        // 5 lines expected:
        // - 3 lines for entries
        // - 1 line for heading
        // - 1 line for trailing line-ending
        return expect(exportArchiveToCSV(this.archive)).to.eventually.satisfy(
            csv => csv.split("\n").length === 5
        );
    });

    it("contains titles, usernames and passwords of entries", function() {
        return exportArchiveToCSV(this.archive).then(output => {
            const items = csvjson.toSchemaObject(output);
            items.forEach(item => {
                expect(item)
                    .to.have.property("title")
                    .that.is.a("string");
                expect(item)
                    .to.have.property("username")
                    .that.is.a("string");
                expect(item)
                    .to.have.property("password")
                    .that.is.a("string");
            });
        });
    });

    it("contains entry IDs", function() {
        return exportArchiveToCSV(this.archive).then(output => {
            const items = csvjson.toSchemaObject(output);
            items.forEach(item => {
                expect(item)
                    .to.have.property("id")
                    .that.matches(UUID_REXP);
            });
        });
    });

    it("contains group IDs and titles", function() {
        return exportArchiveToCSV(this.archive).then(output => {
            const items = csvjson.toSchemaObject(output);
            items.forEach(item => {
                expect(item)
                    .to.have.property("!group_id")
                    .that.matches(UUID_REXP);
                expect(item)
                    .to.have.property("!group_name")
                    .that.is.a("string");
            });
        });
    });
});

describe("exportArchiveToCSVTable", function() {
    beforeEach(function() {
        setup.call(this);
    });

    it("outputs an array", function() {
        const output = exportArchiveToCSVTable(this.archive);
        expect(output).to.be.an("array");
    });

    it("contains the correct number of lines", function() {
        const output = exportArchiveToCSVTable(this.archive);
        expect(output).to.have.lengthOf(3 + 1); // 3 entries, 1 heading
    });
});
