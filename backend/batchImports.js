const { MongoClient } = require("mongodb");

const { flights, reservations } = require("./data");

require("dotenv").config();

console.log(process.env.MONGO_URI);

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const flightsInfo = [];

Object.keys(flights).forEach((flightNumber) => {
  flightsInfo.push({
    _id: flightNumber,
    seats: flights[flightNumber],
  });
});

console.log(flightsInfo);

const batchImports = async () => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("slingair");

  await db.collection("flights").insertMany(flightsInfo);

  await db.collection("reservations").insertMany(reservations);

  client.close();
};

batchImports();
