const cookieParser = require('cookie');
const secret = 'a2463421-b798-470a-b4ee-fd23783ec69d';
const { findUserPerId } = require('../queries/user.queries');
const jwt = require('jsonwebtoken');

const decodeJwtToken = (token)=>{
  return jwt.verify(token, secret)
}
exports.decodeJwtToken = decodeJwtToken;

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).redirect('/auth/signin/form');
  }
}
exports.ensurAuthenticatedSocket = async (request, success)=>{
  try {
    const cookie = cookieParser.parse(request.headers.cookie || "");
    if(cookie && cookie.jwt){
      const decodedToken = decodeJwtToken(cookie.jwt);
      const user = await findUserPerId(decodedToken.sub);
      if(user){
        request.user = user;
        success(null, true);
      }else{
        success(400, false)
      }
    }else{
      success(403, false);
    }
  } catch (error) {
    success(400, false);
  }
}
