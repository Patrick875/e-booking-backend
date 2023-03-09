const { Router } = require("express");
const { serve, setup } = require("swagger-ui-express");
import schemas from "./schema/schemas";
import blogDoc from './blogs';
import authDoc from './auth';
import userDoc from './user';
import categoryDoc from './categories';
import commentDoc from './comments';
import contactDoc from './contacts';

export const swaggerDocRouter = Router();

const options = {
  openapi: "3.0.3",
  info: {
    title: "Anathole's portifolio  API documentation ",
    version: "1.0.0",
    description:
      "The API documentation of all end-points of the Anathole's portifolio build with node.js",
  },
  api: "http://localhost:5000/",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Contacts", description: "contacts | queries"},
    // { name: "Users", description: "Users" },
    { name: "Categories", description: "blog categories" },
    { name: "Blogs", description: "Blogs | articles" },
    { name: "Comments", description: "blog comments" },
  ],
  paths: {
  ...authDoc,
  // ...userDoc,
  ...categoryDoc,
   ...blogDoc,
   ...commentDoc,
   ...contactDoc
,
  },
  components: {
  schemas: schemas,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },


};


swaggerDocRouter.use("/api-docs", serve, setup(options));
