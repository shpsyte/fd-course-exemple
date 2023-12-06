import database from "infra/database";

export default async function status(req, res) {
  const updatedAt = new Date().toISOString();
  let query = await database.query("SHOW server_version;");

  const databaseVersionValue = query.rows[0].server_version;
  const databaseMaxConnextion = +(await database.query("SHOW max_connections;"))
    .rows[0].max_connections;
  const databaseCurrentConnextion = +(
    await database.query(
      "SELECT count(*) FROM pg_stat_activity  WHERE state = 'active';"
    )
  ).rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,

    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnextion,
        current_connections: databaseCurrentConnextion,
      },
    },
  });
}
