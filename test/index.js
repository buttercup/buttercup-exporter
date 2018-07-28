const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

Object.assign(global, {
    expect: chai.expect,
    sinon
});
