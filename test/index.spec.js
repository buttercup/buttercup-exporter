const { Archive } = require("buttercup");
const { exportArchiveToCSVTable } = require("../source/index.js");

describe("exportArchiveToCSVTable", function() {
    beforeEach(function() {
        const archive = this.archive = new Archive();
        const mailGroup = archive.createGroup("Mail");
        mailGroup.createEntry("Hotmail")
            .setProperty("username", "test@hotmail.com")
            .setProperty("password", "abc123")
            .setProperty("URL", "https://login.live.com")
            .setProperty("Secret", "value");
        mailGroup.createEntry("Yahoo")
            .setProperty("username", "test@yahoo.com")
            .setProperty("password", "123abc")
            .setProperty("Pin", "1234");
        archive.createGroup("General")
            .createEntry("Home PC")
            .setProperty("username", "test")
            .setProperty("password", "passw0rd");
    });

    it("outputs an array", function() {
        const output = exportArchiveToCSVTable(this.archive);
        expect(output).to.be.an("array");
    });
});
