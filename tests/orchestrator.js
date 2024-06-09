import retry from "async-retry";
async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 3000,
    });

    async function fetchStatusPage(bail, tryNumber) {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseJson = await response.json();
      if (responseJson.dependencies.database.open_connections > 0) {
        return;
      }
      throw new Error("Database is not ready");
    }
  }
}

export default {
  waitForAllServices,
};
