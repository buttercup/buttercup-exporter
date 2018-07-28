# Buttercup Exporter
> Export Buttercup vaults

[![Build Status](https://travis-ci.org/buttercup/buttercup-exporter.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-exporter) [![npm version](https://badge.fury.io/js/%40buttercup%2Fexporter.svg)](https://www.npmjs.com/package/@buttercup/exporter)

## About
This library provides methods to allow you to export [Buttercup](https://buttercup.pw) vaults to CSV.

Install by running the following:

```shell
npm install @buttercup/exporter --save
```

## Usage
Require the exporter method and pass an archive instance to it:

```javascript
const fs = require("fs");
const { Archive } = require("buttercup");
const { exportArchiveToCSV } = require("@buttercup/exporter");

const archive = new Archive();
archive.createGroup("General")
    .createEntry("email")
        .setProperty("username", "test@mail.com")
        .setProperty("password", "passw0rd");

exportArchiveToCSV(archive).then(csv => {
    fs.writeFileSync("./test.csv", csv);
});
```

`exportArchiveToCSV` takes the archive instance as the only parameter and returns a `Promise`.
