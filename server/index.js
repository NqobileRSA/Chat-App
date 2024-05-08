import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

const app = express();

// envrivonmnet variables
const port = process.env.PORT || 9000;
const connection_url = `MONGO_DB URL`;
// real time coms
// const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1692131",
  key: "c88aeba0fdbe8d6effcd",
  secret: "fbf815fab1f9c057d9c9",
  cluster: "eu",
  useTLS: true,
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world",
});
// db config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API endpoints
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB Connected");
  const msgCollection = db.collection("messagingmessages");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error trigerring Pusher");
    }
  });
});
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hello World"));

// post - user sending data to the database
app.post("/messages/new", async (req, res) => {
  const dbMessage = req.body;
  try {
    const data = await Messages.create(dbMessage);
    res.status(200).send(data);
    console.log(data);
  } catch (error) {
    res.status(500).send(console.log(`an error has occured: ${error}`));
  }
});

// get - takes data from server to client
app.get("/messages/sync", async (req, res) => {
  try {
    const data = await Messages.find({});
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(`An error has occured : ${error}`);
  }
});

// listen to the app
app.listen(port, () => console.log(`listening to port : ${port}`));
