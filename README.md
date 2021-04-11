# Buttercup Exporter
> Export Buttercup vaults

[![Build Status](https://travis-ci.org/buttercup/buttercup-exporter.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-exporter) [![npm version](https://badge.fury.io/js/%40buttercup%2Fexporter.svg)](https://www.npmjs.com/package/@buttercup/exporter)

## About
This library provides methods to allow you to export [Buttercup](https://buttercup.pw) vaults to CSV.

Install by running the following:

```shell
npm install @buttercup/exporter --save
```

Requires NodeJS 10 or later.

## Usage
Require the exporter method and pass an archive instance to it:

```javascript
const fs = require("fs");
const { Vault } = require("buttercup");
const { exportVaultToCSV } = require("@buttercup/exporter");

const vault = new Vault();
vault.createGroup("General")
    .createEntry("email")
        .setProperty("username", "test@mail.com")
        .setProperty("password", "passw0rd");

exportVaultToCSV(vault).then(csv => {
    fs.writeFileSync("./test.csv", csv);
});
```

`exportVaultToCSV` takes the vault instance as the only parameter and returns a `Promise`.
