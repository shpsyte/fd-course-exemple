import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors.js";
import password from "models/password.js";

async function hashPasswordInObject(unserInputValues) {
  const hashedPassword = await password.hash(unserInputValues.password);
  unserInputValues.password = hashedPassword;
}

async function ValidateUniqueUserName(username) {
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

async function ValidateUniqueEmail(email) {
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
  await ValidateUniqueUserName(unserInputValues.username);
  await ValidateUniqueEmail(unserInputValues.email);

  await hashPasswordInObject(unserInputValues);

  const newUser = await runInsertQuery(unserInputValues);
  return newUser;

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

async function update(username, userInputValues) {
  const userFound = await findOneByUsername(username);

  if ("username" in userInputValues) {
    if (
      userFound.username.toLowerCase() !==
      userInputValues.username.toLowerCase()
    ) {
      await ValidateUniqueUserName(userInputValues.username);
    }
  }

  if ("email" in userInputValues) {
    if (userFound.email.toLowerCase() !== userInputValues.email.toLowerCase()) {
      await ValidateUniqueEmail(userInputValues.email);
    }
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = {
    ...userFound,
    ...userInputValues,
  };

  const updateUser = await runUpdateQuery(userWithNewValues);
  return updateUser;
}

async function runUpdateQuery(userWithNewValues) {
  const result = await database.query({
    text: `
          UPDATE
            users
          SET 
            username = $2,
            email    = $3,
            password = $4,
            updated_at = timezone('utc', now())
          WHERE 
            id = $1
          RETURNING
            *
    `,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.email,
      userWithNewValues.password,
    ],
  });

  return result.rows[0];
}

const user = {
  create,
  update,
  findOneByUsername,
};

export default user;
