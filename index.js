const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@redonion.uipb9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todoList").collection("todos");
    //to add todos
    app.post("/addtodo", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });
    //to update
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          complete: true,
        },
      };
      const result = await todoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    //to get todos by user email
    app.get("/todos/:email", async (req, res) => {
      const mail = req.params.email;
      const query = { userMail: mail };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });
    //to delete  todo
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run();

app.get("/", (req, res) => {
  res.send("Todo App Server is running");
});
app.listen(port, () => {
  console.log("Running Port Of Todo App is", port);
});
