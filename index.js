const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqsch.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const foodsCollection = client.db("products").collection("foods");
  const usersCollection = client.db("products").collection("users");
  const ordersCollection = client.db("products").collection("orders");

  app.post("/addFood", (req, res) => {
    const foodInfo = req.body;
    foodsCollection.insertOne(foodInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allFoods", (req, res) => {
    foodsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/food/:id", (req, res) => {
    foodsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    foodsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.post("/setOrder", (req, res) => {
    const userOrder = req.body;
    usersCollection.insertOne(userOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/myOrders", (req, res) => {
    usersCollection
      .find({ Email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/placedOrder", (req, res) => {
    const placeOrder = req.body;
    ordersCollection.insertOne(placeOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  console.log("Db connected", err);
});

app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`);
});
