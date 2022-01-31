"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require("./data");

const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  console.log("connected");

  const db = client.db("slingair");

  const flights = await db.collection("flights").find().toArray();

  const flightNumbers = flights.map((flight) => {
    return flight._id;
  });

  console.log(flightNumbers);

  flightNumbers
    ? res.status(200).json({ status: 200, data: flightNumbers })
    : res.status(404).json({
        status: 404,
        data: null,
        message: "SlingAir can't seem to find flights",
      });

  client.close();
  console.log("disconnected");
};

const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.params._id;

  await client.connect();

  const db = client.db("slingair");

  await db.collection("flights").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const addReservations = async (req, res) => {
  console.log(MONGO_URI);
  console.log(req.body);

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("slingair");
  console.log("connected");

  const confirmation = { _id: uuidv4(), ...req.body };

  await db.collection("reservations").insertOne(confirmation);

  const query = { _id: req.body.flight, "seats.id": req.body.seat };
  const newValues = { $set: { "seats.$.isAvailable": false } };

  await db.collection("flights").updateOne(query, newValues);

  res.status(201).json({ status: 201, data: confirmation });

  client.close();
  console.log("disconnected");
};

const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("slingair");

  const reservations = await db.collection("reservations").find().toArray();

  reservations
    ? res.status(200).json({ status: 200, data: reservations })
    : res.status(404).json({ status: 404, message: "Not Found" });
  client.close();
};

const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = req.params.id;

  await client.connect();

  const db = client.db("slingair");

  await db.collection("reservations").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const id = req.params.id;
  await client.connect();

  const db = client.db("slingair");

  const result = await db.collection("reservations").deleteOne({ id: id });

  const query = { _id: req.body.flight, "seats.id": req.body.seat };
  const newValues = { $set: { "seats.$.isAvailable": true } };

  await db.collection("flights").updateOne(query, newValues);

  res.status(204).json({ status: 204, data: result });

  client.close();
};

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const _id = req.params.id;
  const query = { _id };
  const newValues = { $set: { ...req.body } };
  await client.connect();

  const db = client.db("slingair");

  const result = await db.collection("reservations").findOne({ _id });

  // update the old seat
  const updateQuery = { _id: result.flight, "seats.id": result.seat };
  const updateNewValues = { $set: { "seats.$.isAvailable": true } };

  await db.collection("flights").updateOne(updateQuery, updateNewValues);

  const result = await db
    .collection("reservations")
    .updateOne(query, newValues);

  // Update the new seat
  const reupdateQuery = { _id: req.body.flight, "seats.id": req.body.seat };
  const reupdateNewValues = { $set: { "seats.$.isAvailable": false } };
  await db.collection("flights").updateOne(reupdateQuery, reupdateNewValues);

  res.status(200).json({ status: 200, id, ...req.body });

  client.close();
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
