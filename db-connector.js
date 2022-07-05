/**
 * @type {import(fastify-plugin).FastifyPlugin}
 */

const fastifyPlugin = require("fastify-plugin");

/**
 * connect to mongodb database
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options
 */

async function dbConnector(fastify, options) {
  fastify.register(require("@fastify/mongodb"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: process.env.MONGODB_URL,
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector);
