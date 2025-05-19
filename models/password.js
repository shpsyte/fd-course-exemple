import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  const isMatch = await bcryptjs.compare(providedPassword, storedPassword);
  return isMatch;
}

const password = {
  hash,
  compare,
};

export default password;
