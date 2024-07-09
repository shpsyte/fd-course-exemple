import { Client } from "pg";

async function query(queryObject) {
  const client = await getNewClient();

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (err) {
    console.error({ err });
    throw err;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}
const database = {
  query: query,
  getNewClient: getNewClient,
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    console.log("Using SSL CA from environment variable");
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
