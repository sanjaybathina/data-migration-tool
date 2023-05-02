const { Client } = require("pg");

let data = [
  {
    id: 1,
    name: "John",
    age: 30,
    city: "New York",
  },
  {
    id: 2,
    name: "Jane",
    age: 28,
    city: "Los Angeles",
  },
  {
    id: 3,
    name: "Doe",
    age: 22,
    city: "Chicago",
  },
];
(async () => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    password: "password",
    port: 5432,
    database: "postgres",
  });

  await client.connect();

  //   create database if not exists test
  // await client.query("CREATE DATABASE test");

  await client.query(
    "CREATE TABLE IF NOT EXISTS users (id int, name varchar(255), age int, city varchar(255))"
  );
  await client.query("TRUNCATE TABLE users");
  for (let i = 0; i < data.length; i++) {
    await client.query(
      `INSERT INTO users (id, name, age, city) VALUES (${data[i].id}, '${data[i].name}', ${data[i].age}, '${data[i].city}')`
    );
  }
  await client.end();
})();
