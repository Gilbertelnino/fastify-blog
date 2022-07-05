/**
 * @type {import(fastify-plugin).FastifyPlugin}
 */

const fastifyPlugin = require("fastify-plugin");

/**
 * connect to mongodb database
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options
 */

async function firebaseDbConnector(fastify, options) {
  fastify.register(require("@now-ims/fastify-firebase"), {
    apiKey: fastify.config.apiKey,
    authDomain: fastify.config.authDomain,
    projectId: fastify.config.projectId,
    storageBucket: fastify.config.storageBucket,
    messagingSenderId: fastify.config.messagingSenderId,
    appId: fastify.config.appId,
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(firebaseDbConnector);
