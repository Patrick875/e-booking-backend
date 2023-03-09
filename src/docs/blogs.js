export default {

  // blogs
  "/Api/blogs/add": {
    post: {
      tags: ["Blogs"],
      description: "Create new blog",
      parameters: [
        {
          in: "header",
          name: "token",
          type: "apiKey",
          required: true,
          example: "Bearer ",
          description: "Token authorization",
        },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/Blog",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "successfully",
        },
        401: {
          description: "User Not Authorized",
        },
        422: {
          description: "Unprocessable Entity related to the ID provided",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/blogs/all": {
    get: {
      tags: ["Blogs"],
      description: "Get All Blog Articles",
      parameters: [],
      security: [],
      responses: {
        200: {
          description: "successfully",
        },
        400: {
          description: "Bad Request",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/blogs/{id}": {
    get: {
      security: [],
      tags: ["Blogs"],
      description: "Get single blog by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
      responses: {
        200: {
          description: "successfully",
        },
        204: {
          description: "No Content related to the ID provided",
        },
        400: {
          description: "Bad Request, ID bad formatted",
        },
        422: {
          description: "Unprocessable Entity related to the ID provided",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/blogs/update": {
    put: {
      tags: ["Blogs"],
      description: "Update blog",
      parameters: [
        {
          in: "header",
          name: "token",
          type: "apiKey",
          required: true,
          example: "Bearer ",
          description: "Token authorization",
        },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/Blog",
            },
            default: {
              id: "63c464d52c0cd9743f1c81c1",
            },
          },
        },
        required: true,
      },
      responses: {
        201: {
          description: "successfully",
        },
        401: {
          description: "User Not Authorized",
        },
        422: {
          description: "Unprocessable Entity related to the ID provided",
        },
        404: {
          description: "Article doesn't exist!",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/blogs/delete": {
    delete: {
      tags: ["Blogs"],
      description: "Delete blog article",
      parameters: [
        {
          in: "header",
          name: "token",
          type: "apiKey",
          required: true,
          example: "Bearer ",
          description: "Token authorization",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Blog",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "successfully",
        },
        204: {
          description: "No Content related to the ID provided",
        },
        401: {
          description: "User Not Authorized",
        },
        404: {
          description: "Article doesn't exist!",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
};
