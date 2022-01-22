const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Fareed:SHAIK@cluster0.nx4aj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  client.close();
});
