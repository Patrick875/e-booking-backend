export default {

    "/api/auth/register": {
        post: {
          tags: ["Auth"],
          description: "User registeration",
          security: [],
          parameters: [],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
                example: {
                  names: "Ana10 user",
                  email: "aimeantholex@gmail.com",
                  password: "123456",
                },
              },
            },
            required: true,
          },
          responses: {
            201: {
              description: "New User was created successfully",
            },
            409: {
              description: {message: "User already exists"},
            },
            400: {
              description: "Bad Request, both fields are required",
            },
            500: {
              description: "Internal Server Error",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          description: "User login",
          security: [],
          parameters: [],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
                example: {
                  email: "aimeanathole1@gmail.com",
                  password: "1234",
                },
              },
            },
            required: true,
          },
          responses: {
            200: {
              description: {message: "logged in successfully"},
            },
           
            401: {
              description: {message : "Invalid credatials"},
            },
            500: {
              description:{messsage: "Internal Server Error"},
            },
          },
        },
      },
}