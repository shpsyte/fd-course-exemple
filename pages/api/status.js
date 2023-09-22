


export default function status(req, res) {
 
  res.status(200).json({ status: 'ok mé' });
}

// curl -s -o /dev/null -I -w "%{http_code}" http://localhost:3000/api/status | grep 200