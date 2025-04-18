import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors.js";
import password from "models/password.js";

async function findOneByUsername(username) {
  const result = await database.query({
    text: `
          SELECT
            *
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT 1
          ;`,
    values: [username],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "User not found",
      action: "Check the username and try again",
    });
  }

  return result.rows[0];
}

async function create(unserInputValues) {
  await validdateUniqueEmail(unserInputValues.email);
  await validdateUniqueuserName(unserInputValues.username);

  await hashPasswordInObject(unserInputValues);

  const newUser = await runInsertQuery(unserInputValues);
  return newUser;

  async function validdateUniqueuserName(username) {
    const result = await database.query({
      text: `
          SELECT
            username
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          ;`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "username already exists",
        action: "Utilize another username",
      });
    }
  }
  async function validdateUniqueEmail(email) {
    const result = await database.query({
      text: `
          SELECT
            email
          FROM
            users
          WHERE
            LOWER(email) = LOWER($1)
          ;`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email already exists",
        action: "Utilize another email",
      });
    }
  }

  async function hashPasswordInObject(unserInputValues) {
    const hashedPassword = await password.hash(unserInputValues.password);
    unserInputValues.password = hashedPassword;
  }

  async function runInsertQuery(unserInputValues) {
    const result = await database.query({
      text: `
           INSERT INTO 
              users (username, email, password)
           VALUES ($1, $2, $3) 
          RETURNING
             * 
          ;`,
      values: [
        unserInputValues.username,
        unserInputValues.email,
        unserInputValues.password,
      ],
    });

    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      password: result.rows[0].password,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    };
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
