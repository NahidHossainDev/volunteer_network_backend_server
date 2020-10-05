const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { ObjectID } = require("mongodb");
require("dotenv").config();
ObjectId = require("mongodb").ObjectID;


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("I am on")
})
 
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b31bz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLL}`);
 const personCollection = client.db(`${process.env.DB_NAME}`).collection("person Registered");
  app.post("/addEvent", (req, res) => {
    eventCollection.insertOne(req.body)
      .then((result) => {
        res.send("Your post uploaded Successfully...!");
      });
  });
  
  app.get('/showEvent', (req, res) => {
    eventCollection.find({})
      .toArray((err, document) => {
      res.send(document)
    })
  })

  app.post("/addRegisteredData", (req, res) => {
     console.log(req.body)
    personCollection.insertOne(req.body)
      .then((result) => {
        res.send(result.insertedCount>0);
      });
  });
  
  app.get("/showPersonRegistered", (req, res) => {
    personCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.delete("/deletePerson/:id", (req, res) => {
    personCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
      res.send(result.deletedCount > 1);
    })
  });

  app.get("/getMyEvents", (req, res) => {
    personCollection.find({ email: req.query.email })
      .toArray((err, document) => {
      res.send(document)
    })
  })

   app.delete("/deleteMyEvent/:id", (req, res) => {
     personCollection
       .deleteOne({ _id: ObjectId(req.params.id) })
       .then((result) => {
         res.send(result.deletedCount > 1);
       });
   });

});



app.listen(5000)