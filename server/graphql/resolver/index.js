const { mergeResolvers } = require("@graphql-tools/merge");
const authResolvers = require("./authResolvers");
const studentResolvers = require("./studentResolver");

module.exports = mergeResolvers([authResolvers, studentResolvers]);
