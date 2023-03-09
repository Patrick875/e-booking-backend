
export default  {
    Contact: {
      type: "object",
  
      properties: {
        id: {
          type: "string",
          description: "The auto-generated id of the message",
        },
        names: {
          type: "string",
          description: "sender name",
        },
        email: {
          type: "string",
          description: "sender email",
        },
        description: {
          type: "string",
          description: "message content",
        },
      },
    },
    User: {
      type: "object",
  
      properties: {
        id: {
          type: "string",
          description: "The auto-generated id of the user",
        },
        username: {
          type: "string",
          description: "User's names",
        },
        password: {
          type: "string",
          description: "User's password",
        },
        email: {
          type: "string",
          description: "User's email",
        },
        role: {
          type: "string",
          description: "User role",
        },
      },
    },
    Category: {
      type: "object",
  
      properties: {
          id: {
            type: "string",
            description: "The auto-generated id of the category",
          },
        name: {
          type: "string",
          description: "blog category name",
        },
        status: {
          type: "string",
          description: "muted or muted status",
        },
      },
    },
    Blog: {
      type: "object",
  
      properties: {
          category: {
            type:  "string",
            description: "blog category id",
          }
          ,
        title: {
          type: "string",
          description: "Article title",
        },
        description: {
          type: "string",
          description: "blog content",
        },
        image: {
          type: "string",
          description: "blog image",
          format: "binary",
        },
      },
    }
    ,Comments: {
      type: "object",
      properties: {
          id: {
            type: "string",
            description: "The auto-generated id of the comment",
          },
        names: {
          type: "string",
          description: "comment author name",
        },
        email: {
          type: "string",
          description: " comment author email",
        },
        description: {
          type: "string",
          description: "comment content",
          format: "binary",
        },
      },
    }
  
  }
  