import contactDoc from "../documentantion/contacts";
import categoryDoc from "../documentantion/categories";

let constant = {
  info: {
    title: "Anathole'sPortifolio API Documentation",
    description: "Anathole'sPortifolio API Documentation",
    version: "1.0.0",
  },
};

let servers = [
  {
    url: "http://127.0.0.1:5000/",
  },
];

const contacts = {
  definition: {
    openapi: "3.0.0",
    constant,
    servers: servers,
    paths: {
      ...contactDoc,
    },
  },
  apis: ["./api-docs/"],
};

const categories = {
  definition: {
    openapi: "3.0.0",
    constant,
    servers: servers,
    paths: {
      ...categoryDoc,
    },
  },
  apis: ["./api-docs/"],
};

export default {contacts, categories};