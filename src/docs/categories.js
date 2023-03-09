export default {
  // category
  "/api/categories/add": {
    post: {
      tags: ["Categories"],
      security: [],
      description: "add a  blog category",
      parameters: [
        {
          in: 'header',
          name: 'token',
          type: 'apiKey',
          required: true,
          example: 'Bearer ',
          description: "Token authorization",
        }
          
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Category",
            },
            example: {
              name: "Software Development",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "successfully",
        },
        400: {
          description: "bad request, all fields are required",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/api/categories/all": {
    get: {
      tags: ["Categories"],
      description: "Getting all blog categories",
      parameters: [],
      responses: {
        200: {
          description: "successfully",
        },
        401: {
          description: "Not Authorized",
        },
        403: {
          description: "Forbidden Access",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/categories/{id}": {
    get: {
      security: [],
      tags: ["Categories"],
      description: "single category by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
      responses: {
        200: {
          description: {message : "successfully"},
        },
        204: {
          description: {message : 'Category not found'},
        },
        422 :{
          description: {message : 'Category ID unpreccessable'},

        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },

  "/api/categories/update": {
    put: {
      tags: ["Categories"],
      security: [],
      description: "Update | edit a comment by id",
      parameters: [
        {
          in: "header",
          name: "token",
          type: "apiKey",
          required: true,
          example: 'Bearer ',
          description: "Token authorization",
        }
        ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Category",
            },
            example: {
              id: '63bf8a9ebb9f502223bb30ad',
              name: "software development",
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
          description: "Category not found",
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

  "/api/categories/delete": {
    delete: {
      security: [],
      tags: ["Categories"],
      description: "delete a category by id",
      parameters: [
      { 
        in: "header",
        name: "token",
        type: "apiKey",
        required: true,
        example: 'Bearer ',
        description: "Token authorization",
      }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Category",
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
        204: {
          description: "Category not found",
        },
        400: {
          description: "Category ID unpreccessable",
        },
        401: {
          description: "User Not Authorized",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  


}