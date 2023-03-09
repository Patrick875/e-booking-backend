export default {
  // comments
  "/api/comments/add/{blog_id}": {
    post: {
      tags: ["Comments"],
      security: [],
      description: "comment on a blog",
      parameters: [
        {
          in: "path",
          name: "blog_id",
          required: true,
          schema: {
            type: "string",
          },
          description: "blog id",
          example: "63c464d52c0cd9743f1c81c1",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Comments",
            },
            example: {
              names: "Anathole Ana10",
              email: "aimeanathole@gmail.com",
              description: "Hello, I want a modern website",
            },
          },
        },
        required: true,
      },
      responses: {
        201: {
          description: "successfully",
        },
        400: {
          description: "bad request, blog Id is required",
        },
        404: {
          description: "blog not found",
        },
        422: {
          description: "unprocessable entity",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/api/comments/all/{blog_id}": {
    get: {
      tags: ["Comments"],
      description: "Getting all blog comments",
      parameters: [
        {
          in: "path",
          name: "blog_id",
          required: true,
          schema: {
            type: "string",
          },
          description: "blog id",
          example: "63c464d52c0cd9743f1c81c1",
        },
      ],
      responses: {
        200: {
          description: "successfully",
        },
        204: {
          description: "no content",
        },
        400: {
          description: "bad request, blog Id is required",
        },
        404: {
          description: "blog not found",
        },
        422: {
          description: "unprocessable entity",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/comments/delete": {
    delete: {
      security: [],
      tags: ["Comments"],
      description: "delete a commets by id",
      parameters: [
        {
          in: "body",
          name: "id",
          required: true,
        }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Comments",
            },
            example: {
              id: '63c464d52c0cd9743f1c81c1',
            },
          },
        },
        required: true,
      },

      responses: {
        200: {
          description: "successfully",
        },
        204 :{
          description: "no content",
        },
        400: {
          description: "bad request",
        },
        404: {
          description: "Comment not found",
        },
        422: {
          description: "unprocessable entity",
        },

        500: {
          description: "Internal Server Error",
        },
      },
      
    },
  },
};
