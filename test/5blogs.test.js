process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import path from "path";
import app from "../src/index";
import request from "supertest";
import User from "../src/models/User";
import Blog from "../src/models/Blog";
import Category from "../src/models/Category";
import Comment from "../src/models/Comment";

let should = chai.should();
chai.use(chaiHttp);
const expect = chai.expect;

const rqst = request(app);

let token = "";
let blogId;
let blogCategoryId = "";
let newBlog;
let comments

describe("-----Blogs------", async function () {
  before(async (done) => {
    await Blog.deleteMany({}, done());
  });

  // afterEach(async (done) => {
  //   await Blog.deleteOne({}, done());
  // });

  it("/GET returns all blogs, and 200 status", async () => {
    const response = await rqst.get("/api/blogs/all");
    expect(response.status).to.eql(200);
  });

  it("/POST blog require Authentication -> forbbiden (401)", async () => {
    const response = await rqst
      .post("/api/blogs/add")
      .send({
        title: "Anathole test",
        category: "",
        description: "anatholetes@gmail.com",
        image: "",
        password: "1234",
      })
      .expect((response) => {
        expect(response.status).to.eql(401);
      });
  });

  it("/DELTE blog require Authentication to delete -> forbbiden (401)", async () => {
    const response = await rqst
      .delete("/api/blogs/delete")
      .send({
        title: "Anathole test",
        category: "",
        description: "anatholetes@gmail.com",
        image: "",
        password: "1234",
      })
      .expect((response) => {
        expect(response.status).to.eql(401);
      });
  });

  it("/PUT update blog require Authentication to update -> forbbiden (401)", async () => {
    const response = await rqst
      .put("/api/blogs/update")
      .send({
        title: "Anathole test",
        category: "",
        description: "anatholetes@gmail.com",
        image: "",
        password: "1234",
      })
      .expect((response) => {
        expect(response.status).to.eql(401);
      });
  });

  it("/POST blog require both fields filled no title and description  -> returns  (400)", async function () {
    await rqst.post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const loginResponse = await rqst.post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });

    token = loginResponse.body.accessToken;

    const category = await rqst
      .post("/api/categories/add")
      .set({
        token: `Bearer ${token}`,
      })
      .send({
        name: "Software Development",
      });

    blogCategoryId = category.body.result._id;

    const res = await rqst
      .post("/api/blogs/add")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("category", blogCategoryId)
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    expect(res.status).to.eql(400);
  });

  // delete blog fails no Id passed in the body
  it("/DELTE blog fails no Id passed via body (400)", async () => {
    const response = await rqst
      .delete("/api/blogs/delete")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title")
      .expect((response) => {
        expect(response.status).to.eql(400);
      });
  });

  it("/POST create new blog require both fields filled  -> returns  (201) ", async function () {
    const category = await rqst
      .post("/api/categories/add")
      .set({
        token: `Bearer ${token}`,
      })
      .send({
        name: "Software Development",
      });

    const blogCategoryId = category.body.result._id;
    const res = await rqst
      .post("/api/blogs/add")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title")
      .field("description", "Blog description")
      .field("category", blogCategoryId)
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    blogId = res.body.result._id;
    expect(res.status).to.eql(201);
  });

  it("/POST  single blog, and returns 200 status", async () => {
    const res = await rqst
      .post("/api/blogs/add")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title")
      .field("description", "Blog description")
      .field("category", blogCategoryId)
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );

    blogId = res.body.result._id;
    const response = await rqst.get(`/api/blogs/${blogId}`);
    expect(response.status).to.eql(200);
  });

  // create new category fails bad category Id format -> returns  (422)
  it("/POST not created blog category ID bad format -> status 422", async () => {
    const res = await rqst
      .post("/api/blogs/add")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title")
      .field("description", "Blog description")
      .field("category", "fdsfjshjfhjsdfjfdgddhsjdfjsd")
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    expect(res.status).to.eql(422);
  });

  // add blog Id not found
  it("/POST create blog category ID not found 204 ", async () => {
    await Category.deleteOne({});
    const res = await rqst
      .post("/api/blogs/add")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set({ token: `Bearer ${token}` })
      .field("id", blogId)
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title")
      .field("description", "Blog description")
      .field("category", "63df644cbcaa1a120c9662db")
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    expect(res.status).to.eql(204);
  });

  // update no Blog Id passed
  it("/PUT update  blog fail blog Id not passed via body params  -> returns  (400) ", async function () {
    const res = await rqst
      .put("/api/blogs/update")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("title", "Blog title edited")
      .field("description", "Blog description edited")
      .field("category", blogCategoryId)
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    expect(res.status).to.eql(400);
    expect(res.body.message).to.eql("ID parameter is required.");
    // expect(res.body).to.be('Object');
  });


  // update no existing Blog Id 
  it("/PUT update  blog fail blog Id doesn't exist  -> returns  (402) ", async  () => {
    const res = await rqst
      .put("/api/blogs/update")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set({ token: `Bearer ${token}` })
      .field("Content-Type", "multipart/form-data")
      .field("id", '63d9cc7d5edb78550c1473cf')
      .field("title", "Blog title edited")
      .field("description", "Blog description edited")
      .field("category", blogCategoryId)
      .attach(
        "image",
        fs.readFileSync(path.join(__dirname, "blog_test.png")),
        "blog_test.png"
      );
    expect(res.status).to.eql(204);
    expect(res.body).to.be.an('Object');
  });

  // update blog successfully
  it("/POST will update blog returns (200) status", async () => {
    const category = await rqst
      .post("/api/categories/add")
      .set({
        token: `Bearer ${token}`,
      })
      .send({
        name: "Software Development",
      });

    const blogCategoryId = category.body.result._id;

    setTimeout(async () => {
      newBlog = await rqst
        .post("/api/blogs/add")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
        .field("title", "Blog title")
        .field("description", "Blog description")
        .field("category", blogCategoryId)
        .attach(
          "image",
          fs.readFileSync(path.join(__dirname, "blog_test.png")),
          "blog_test.png"
        );
      blogId = newBlog.body.result._id;
      console.log(blogId);

      const res = await rqst
        .put("/api/blogs/update")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
        .field("id", blogId)
        .field("title", "Blog title")
        .field("description", "Blog description");

      expect(res.status).to.eql(200);
      expect(res.body).to.be("Object");
    }, 1000);
  });



  it("/POST will fail update blog returns (422) status", async () => {
    const category = await rqst
      .post("/api/categories/add")
      .set({
        token: `Bearer ${token}`,
      })
      .send({
        name: "Software Development",
      });

    const blogCategoryId = category.body.result._id;

    setTimeout(async () => {

      const res = await rqst
        .put("/api/blogs/update")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
        .field("id", 'jfshfjsdfjhsdjkflsdjff;skdjflkshljsldfsdf')
        .field("title", "Blog title")
        .field("description", "Blog description");

      expect(res.status).to.eql(422);
      expect(res.body).to.be("Object");
      expect(res.body.message).to.eql("Id should be a valid mongoose ObjectId");
    }, 1000);
  });


    // Delete
    it("/DELETE delete  blog fail blog Id doesn't exist  -> returns  (204) ", async  () => {
      const res = await rqst
        .delete("/api/blogs/delete")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
        .field("id", '63d9cc7d5edb78550c1473cf')
      expect(res.status).to.eql(204);
      expect(res.body).to.be.an('Object');
    });
  


    // Delete
    it("/DELETE delete  blog fail blog Id doesn't exist  -> returns  (422) ", async  () => {
      const res = await rqst
        .delete("/api/blogs/delete")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
        .field("id", '63d9cc7d5edb78550c14fsdnfmdfnmdjgkdfgjdkffsd73cf')
      expect(res.status).to.eql(422);
      expect(res.body).to.be.an('Object');
    });
  


    // Delete
    it("/GET delete  blog fail blog Id doesn't exist  -> returns  (422) ", async  () => {
      const res = await rqst
        .get("/api/blogs/63d9cc7d5edb78550c14fsdnfmdfnmdjgkdfgjdkffsd73cf")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set({ token: `Bearer ${token}` })
        .field("Content-Type", "multipart/form-data")
      expect(res.status).to.eql(422);
      expect(res.body).to.be.an('Object');
    });
  

  // COMMENTS

  it("/POST blog comment  201", async () => {
    console.log(
      "===================== COMMENTS || BLOGS ======================="
    );

    const response = await rqst.post(`/api/comments/add/${blogId}`).send({
      names: "Anathole test",
      email: "aimeanathole@example.com",
      description: "Comment test",
    });

    expect(response.status).to.eql(201);
    expect(response.body).to.be.an("Object");
    expect(response.body).to.have.property("message");
  });


  it("/POST blog comment  422", async () => {
    const response = await rqst
      .post(`/api/comments/add/fskfhskhkhjfhkshjfksfhjdsfs`)
      .send({
        names: "Anathole test",
        email: "aimeanathole@example.com",
        description: "Comment test",
      });

    expect(response.status).to.eql(422);
    expect(response.body).to.be.an("Object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.eql(
      "Blog Id should be a valid mongoose ObjectId"
    );
  });

  it("/GET returns all blogs comments empty array, and 204 status", async () => {
    const response = await rqst.get(
      `/api/comments/all/63d9cc7d5edb78550c1473cf`
    );
    expect(response.status).to.eql(204);
  });

  it("/GET all comments, fails with Blog Id bad format 422 status", async () => {
    const response = await rqst.get(
      `/api/comments/all/hfkdgjhdfsfddfsdfskdfhgkdhfgkdf`
    );
    expect(response.status).to.eql(422);
    expect(response.body).to.be.an("object");
    expect(response.body.message).to.eql(
      "Blog Id should be a valid mongoose ObjectId"
    );
  });

  it("/POST blog comment missing property 400", async () => {
    const response = await rqst.post(`/api/comments/add/${blogId}`).send({
      names: "Anathole test",
      email: "aimeanathole@example.com",
    });
    expect(response.status).to.eql(400);
    expect(response.body).to.be.an("Object");
  });

  it("/PUT blog comment  400", async () => {
    const response = await rqst.put(`/api/comments/update`).send({
      names: "Anathole test",
    });
    expect(response.status).to.eql(400);
    expect(response.body).to.be.an("Object");
    expect(response.body).to.have.property("message");
  });

  // get a single comment
  it("/GET blog comment  422", async () => {
    const response = await rqst
    .get(`/api/comments/fskfhskhkhjfhkshjfksfhjdsfs`)
    .send({
      names: "Anathole test",
    });
    
      expect(response.status).to.eql(422);
      expect(response.body).to.be.an('Object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.eql('Comment Id should be a valid mongoose ObjectId');
    
  });

  // update comment successfully
  it("/PUT update blog comment  201", async () => {

    comments = await rqst.get(`/api/comments/all/${blogId}`);
    do{
      await rqst.post(`/api/comments/add/${blogId}`).send({
        names: "Anathole test",
        email: "aimeanathole@example.com",
        description: "Comment test",
      });
    }

    while(comments.body[0]?.comments.length == 0){
      await rqst.post(`/api/comments/add/${blogId}`).send({
        names: "Anathole test",
        email: "aimeanathole@example.com",
        description: "Comment test",
      });

      comments = await rqst.get(`/api/comments/all/${blogId}`);
    }
    
    // console.log(comments.body[0].comments);

    const response = await rqst.put(`/api/comments/update`).send({
      id: comments.body[0].comments[0]._id,
      description: "Comment test edited",
    });

    expect(response.status).to.eql(201);
    expect(response.body).to.be.an("Object");
    expect(response.body).to.have.property("message");
  });

  // Delete  a comment  Doest exist

  it("/DELETE blog comment  204", async () => {

    const response = await rqst.delete(`/api/comments/delete`).send({
      id: '63d9cc7d5edb78550c1473cf',
    });

    expect(response.status).to.eql(204);
    expect(response.body).to.be.an("Object");
  });

  // delete comment
  it("/DELETE delete blog comment  400", async () => {
    newBlog = await rqst.get(`/api/blogs/${blogId}`);
    const response = await rqst.delete(`/api/comments/delete`).send({});
    expect(response.status).to.eql(400);
    expect(response.body).to.be.an("Object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.eql("Comment ID required.");
  });

  // after(async (done) => {
  //   await User.deleteOne({}, done());
  // });
});
