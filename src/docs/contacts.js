
   export default {
     "/api/contacts/add": {
    post: {
      tags: ["Contacts"],
      security: [],
      description: "Sending message query",
      parameters: [],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Contact",
            },
            example: {
              names: "Anathole Ana10",
              email: "Ana10@webmail.com",
              description: "message description",
            },
          },
        },
        required: true,
      },
      responses: {
        201: {
          description:  "Message sent successfully",
        },
        400: {
          description:  'bad request, all filds are required',
         
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  
  "/api/contacts/all": {
    get: {
      tags: ["Contacts"],
      description: "Getting all contacts queries",
      security: [],

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
      responses: {
        200: {
          description: "successfully",
        },
        204 : {
          description: {message: " No Contacts found!"},},
        },
        401: {
          description: "Not Authorized",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  
  "/api/contacts/{id}": {
    get: {
      security: [],
      tags: ["Contacts"],
      description: "Get single contact by id",
      parameters: [
        {
          in: 'header',
          name: 'token',
          type: 'apiKey',
          example: 'Bearer ',
          description: "Token authorization",
          required: true,
        },
        {
          in: "path",
          name: "id",
          example : "63c000daf9c95832580c98db",
          required: true,
        },

      ],
      responses: {
        200: {
          description: "successfully",
        },
        400: { 
          description: 'Contact ID required.' 
        },
        401: {
          description: "Not Authorized",
        },
        500: {
          description:  "Internal Server Error",
        },
      },
    },
},

  "/api/contacts/delete": {
    delete: {
      security: [],
      tags: ["Contacts"],
      description: "delete contact by id",
      parameters: [
        {
          in: 'header',
          name: 'token',
          type: 'apiKey',
          example: 'Bearer ',
          description: "Token authorization",
          required: true,
        }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Contact",
            },
            example: {
              id: "63c464d52c0cd9743f1c81c1",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "successfully",
        },
        204 : {
          description: "No Contacts found!"
        },
        400 : {
          description:  "bad request, Id required",
        },
        403 : {
          description:  "Not Authorized",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
}