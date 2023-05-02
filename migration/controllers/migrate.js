const { getClient } = require("../lib/mongo");
const { Client } = require("pg");
const ObjectId = require("mongodb").ObjectId;

const getHostData = async (_id) => {
  console.log("getHostData", _id);
  const client = await getClient();
  const collection = client.collection("hosts");

  const host = await collection.findOne({ _id: new ObjectId(_id) });
  return host;
};

const updateMigrationStatus = async (_id, status) => {
  const client = await getClient();
  const collection = client.collection("migrations");

  await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { status, updatedAt: new Date() } }
  );
  console.log("INFO: migration status updated in mongodb successfully");
};

const migrate = async (data) => {
  const {
    _id,
    sourceHostId,
    sourceDatabase,
    destinationHostId,
    destinationDatabase,
  } = JSON.parse(data);
  console.log(JSON.parse(data));
  try {
    console.log({
      sourceHostId,
      sourceDatabase,
      destinationHostId,
      destinationDatabase,
    });
    const sourceHost = await getHostData(sourceHostId);
    const destinationHost = await getHostData(destinationHostId);

    const sourceClient = new Client({
      user: sourceHost.username,
      host: sourceHost.host,
      password: sourceHost.password,
      port: sourceHost.port,
      database: sourceDatabase,
    });

    const destinationClient = new Client({
      user: destinationHost.username,
      host: destinationHost.host,
      password: destinationHost.password,
      port: destinationHost.port,
      database: destinationDatabase,
    });

    await sourceClient.connect();
    await destinationClient.connect();

    // use database
    // await sourceClient.query(`USE ${sourceDatabase}`);
    // await destinationClient.query(`USE ${destinationDatabase}`);

    const sourceTables = await sourceClient.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const destinationTables = await destinationClient.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );

    const sourceTablesNames = sourceTables.rows.map((row) => row.table_name);
    const destinationTablesNames = destinationTables.rows.map(
      (row) => row.table_name
    );

    const tablesToMigrate = sourceTablesNames.filter(
      (table) => !destinationTablesNames.includes(table)
    );

    console.log("INFO: tables to migrate: ", tablesToMigrate.join(", "));
    for (let i = 0; i < tablesToMigrate.length; i++) {
      const table = tablesToMigrate[i];
      const tableData = await sourceClient.query(`SELECT * FROM ${table}`);
      const tableColumns = tableData.fields.map((field) => field.name);
      const tableRows = tableData.rows;

      console.log(`INFO: migrating table ${table}...`);

      const columnsString = tableColumns.join(", ");
      const columnsNamesWithTypes = await sourceClient.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`
      );
      const valuesString = tableRows
        .map((row) => {
          const values = tableColumns.map((column) => {
            const value = row[column];
            if (typeof value === "string") {
              return `'${value}'`;
            }
            return value;
          });
          return `(${values.join(", ")})`;
        })
        .join(", ");

      // drop table in destination database if exists
      console.log(`INFO: dropping table ${table}...`);
      await destinationClient.query(`DROP TABLE IF EXISTS ${table}`);

      console.log(
        `INFO: creating table ${table}... with columns: ${columnsNamesWithTypes.rows
          .map((row) => `${row.column_name} ${row.data_type}`)
          .join(", ")}`
      );
      // create table in destination database if not exists
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${table} (${columnsNamesWithTypes.rows
        .map((row) => `${row.column_name} ${row.data_type}`)
        .join(", ")})`;
      await destinationClient.query(createTableQuery);
      console.log(`INFO: table ${table} created`);

      const query = `INSERT INTO ${table} (${columnsString}) VALUES ${valuesString}`;
      await destinationClient.query(query);
      console.log(`INFO: table ${table} migrated`);
    }

    await sourceClient.end();
    await destinationClient.end();
    console.log("INFO: migration finished");
    await updateMigrationStatus(_id, "completed");
  } catch (error) {
    console.log("ERROR: ", error);
    await updateMigrationStatus(_id, "failed");
  }
};

module.exports = {
  migrate,
};
