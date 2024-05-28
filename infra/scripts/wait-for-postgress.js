// just for max compability, we're using required since this file
// wont be transpiled

const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");

      checkPostgres();
      return;
    }

    console.log("\n 🟢 Postgres is ready!\n");
  }
}

process.stdout.write("\n 🔴 Checking Postgres services");
checkPostgres();
