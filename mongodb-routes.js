/**
 * Encupsulates the routes for the application.
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options
 */

async function routes(fastify, options) {
  const collection = await fastify.mongo.db.collection("blogs");

  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  const optObject = {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
      },
    },
  };

  // array response
  const optArray = {
    schema: {
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
            },
          },
        },
      },
    },
  };

  fastify.get("/blog/all", optArray, async (request, reply) => {
    const blogs = await collection.find({}).toArray();
    if (blogs.length === 0) {
      throw new Error("No blogs found");
    }
    return blogs;
  });

  // get a blog by id
  fastify.get("/blog/:id", optObject, async (request, reply) => {
    const id = request.params.id;
    const ObjectId = require("mongodb").ObjectId;
    const blog = await collection.findOne({ _id: ObjectId(id) });
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  });

  //   blog schema
  const blogBodySchema = {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string" },
      content: { type: "string" },
    },
  };
  const schema = {
    body: blogBodySchema,
  };

  // create blog
  fastify.post("/blogs", { schema }, async (request, reply) => {
    const { title, content } = request.body;
    await collection.insertOne({ title, content });
    return request.body;
  });

  // update blog
  fastify.patch("/blog/:id", { schema }, async (request, reply) => {
    const { id } = request.params;
    const ObjectId = require("mongodb").ObjectId;
    // find document
    const blog = await collection.findOne({ _id: ObjectId(id) });
    if (!blog) {
      throw new Error("Blog not found");
    }
    // update document
    const { title, content } = request.body;
    const updateTitle = title ? title : blog.title;
    const updateContent = content ? content : blog.content;
    const updated = await collection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { title: updateTitle, content: updateContent } },
      { new: true }
    );

    return updated.value;
  });

  // delete blog
  fastify.delete("/blog/:id", async (request, reply) => {
    const { id } = request.params;
    const ObjectId = require("mongodb").ObjectId;
    // find document
    const blog = await collection.findOne({ _id: ObjectId(id) });
    if (!blog) {
      throw new Error("Blog not found");
    }
    // delete document
    await collection.deleteOne({ _id: ObjectId(id) });
    return { message: "Blog deleted" };
  });
}

module.exports = routes;
