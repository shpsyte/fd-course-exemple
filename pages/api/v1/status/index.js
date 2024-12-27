import database from "infra/database";
import { InternalServerError } from "infra/errors";

export default async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();
    let query = await database.query("SHOW server_version;");
    const databaseVersionValue = query.rows[0].server_version;
    query = await database.query("SHOW max_connections;");
    const databaseMaxConValue = +query.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;

    query = await database.query({
      text: `SELECT count(*)::int 
              FROM pg_stat_activity  
              WHERE datname = $1;`,
      values: [databaseName],
    });

    const databaseCurrentConnextion = query.rows[0].count;

    res.status(200).json({
      updated_at: updatedAt,

      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: databaseMaxConValue,
          open_connections: databaseCurrentConnextion,
        },
      },
    });
  } catch (error) {
    console.error({ error });
    const publicErrir = new InternalServerError({
      cause: error,
    });
    console.error({ publicErrir });
    res.status(500).json(publicErrir);
  }
}
