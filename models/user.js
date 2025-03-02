import database from "infra/database";

async function create(unserInputValues) {
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

const user = {
  create,
};

export default user;
