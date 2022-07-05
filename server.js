/**
 * @type {import(fastify).FistifyInstance} instance of fastify
 */
const fastify = require("fastify")({
  logger: true,
});
const fastifyEnv = require("@fastify/env");

// .env schema
const schema = {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    authDomain: { type: "string" },
    projectId: { type: "string" },
    storageBucket: { type: "string" },
    messagingSenderId: { type: "string" },
    appId: { type: "string" },
    MONGODB_URL: { type: "string" },
  },
};

const options = {
  confKey: "config",
  schema: schema,
  dotenv: true,
};
// Register the plugin
fastify.register(fastifyEnv, options).ready((err) => {
  if (err) {
    throw err;
  }
});

// database connection
const firebaseDb = require("./firebase-db");
const dbConnector = require("./db-connector");
fastify.register(dbConnector);
fastify.register(firebaseDb);

// routes
const mongodbRoutes = require("./mongodb-routes");
const firebaseRoutes = require("./firebase-routes");

fastify.register(mongodbRoutes);
fastify.register(firebaseRoutes, { prefix: "/firebase" });

// run the server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await fastify.listen({ port });
    fastify.log.info(`server listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
