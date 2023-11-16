import database from 'infra/database';


export default async function status(req, res) {
  const result = await database.query('SELECT 1 + 1 as sum');
  // console.log(result.rows[0].sum);
  res.status(200).json({ status: 'ok ne' });
}

// curl -s -o /dev/null -I -w "%{http_code}" http://localhost:3000/api/status | grep 200