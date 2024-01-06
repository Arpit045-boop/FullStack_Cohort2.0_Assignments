const zod = require("zod");
const jwt = require("jsonwebtoken");
const jwtPassword = "secret";

const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

function signJwt(username, password) {
  const usernamereponse = emailSchema.safeParse(username);
  const passwordResponse = passwordSchema.safeParse(password);
  // Your code here
  if (!usernamereponse.success || !passwordResponse.success) {
    return null;
  }
  var token = jwt.sign({ username }, jwtPassword);
  return token;
}

function verifyJwt(token) {
  // Your code here

  try {
    const verifiedValue = jwt.verify(token, jwtPassword);
    if (verifiedValue) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

function decodeJwt(token) {
  // Your code here
  const decode = jwt.decode(token);
  if (decode) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  signJwt,
  verifyJwt,
  decodeJwt,
  jwtPassword,
};
