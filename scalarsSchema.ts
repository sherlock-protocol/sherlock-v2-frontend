const { buildSchema } = require("graphql")
const { typeDefs } = require("graphql-scalars")

module.exports = buildSchema(typeDefs.join(" "))
