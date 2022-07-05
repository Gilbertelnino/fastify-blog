/**
 * Encupsulates the routes for the application.
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options
 */

async function firebaseBlogRoutes(fastify, options) {
  // get all blogs from firestore

  // response
  const optArray = {
    schema: {
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
            },
          },
        },
      },
    },
  };

  fastify.get("/blog/all", optArray, async (request, reply) => {
    const blogs = await fastify.firebase.firestore().collection("blogs").get();
    if (blogs.empty) {
      throw new Error("No blogs found");
    }
    return blogs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  });

  // create a blog in firestore
  const optObject = {
    schema: {
      body: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
        },
      },
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

  fastify.post("/blog/create", optObject, async (request, reply) => {
    const { title, content } = request.body;

    // create a new blog in firestore
    await fastify.firebase.firestore().collection("blogs").add({
      title,
      content,
    });
    // return created blog
    return { title, content };
  });

  // get a blog by id
  fastify.get("/blog/:id", async (request, reply) => {
    const id = request.params.id;
    const blog = await fastify.firebase
      .firestore()
      .collection("blogs")
      .doc(id)
      .get();
    if (!blog.exists) {
      throw new Error("Blog not found");
    }
    return blog.data();
  });

  // update blog
  fastify.patch("/blog/:id", optObject, async (request, reply) => {
    const id = request.params.id;
    const { title, content } = request.body;
    await fastify.firebase.firestore().collection("blogs").doc(id).update({
      title,
      content,
    });
    return { title, content };
  });

  // delete blog
  fastify.delete("/blog/:id", async (request, reply) => {
    const id = request.params.id;
    await fastify.firebase.firestore().collection("blogs").doc(id).delete();
    return { message: "Blog deleted" };
  });
}

module.exports = firebaseBlogRoutes;
