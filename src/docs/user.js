export default {
  // comments
  "api/users/add": {
    post: {
      tags: ["Users"],
      security: [],
      description: "add a user",
      parameters: [
        {
          in: "headers",
          name: "authorization" || "Authorization",
          required: true,
          schema: {
            type: "string",
          },
          description: "Token string",
          example:
            "efe32faedf21d0592417dcaaa99775c03b1456be519fed929fcc6d79f069ac4d90f5c15f45f6a9b3f0c8fc2e643aab59a510e841a152562936500acddeae5c09",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
            example: {
              names: "Anathole Ana10",
              email: "aimeanathole@gmail.com",
              password: "1234",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "successfully",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  "api/users/all": {
    get: {
      tags: ["Users"],
      description: "Getting all users",
      parameters: [
        {
          in: "headers",
          name: "authorization" || "Authorization",
          required: true,
          schema: {
            type: "string",
          },
          description: "Header token string",
          example:
            "efe32faedf21d0592417dcaaa99775c03b1456be519fed929fcc6d79f069ac4d90f5c15f45f6a9b3f0c8fc2e643aab59a510e841a152562936500acddeae5c09",
        },
      ],
      responses: {
        200: {
          description: "successfully",
        },
        401: {
          description: "Not Authorized",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/users/delete": {
    delete: {
      security: [],
      tags: ["Users"],
      description: "delete a user by id",
      parameters: [],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
              example: {
                names: "Anathole Ana10",
                email: "aimeanathole@gmail.com",
                password: "1234",
              },
            },
          },
          required: true,
        },
      },
      responses: {
        200: {
          description: "successfully",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
};
