// // auth.js

// const jwt = require('jsonwebtoken');

// // Middleware function to authenticate JWT tokens
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) {
//     return res.sendStatus(401); // Unauthorized
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(403); // Forbidden
//     }
//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'jwt-secret-key', (err, user) => { // Ensure the secret key matches
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
