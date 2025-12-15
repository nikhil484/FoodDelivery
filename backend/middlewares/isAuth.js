import jwt from 'jsonwebtoken'
// const isAuth = async(req,res,next)=>{
//     try {
//         const token= req.cookies.token
//         if(!token){
//             return res
//             .status(400)
//             .json({message:"Token Not Found"})

//         }
//         const decodeToken=  jwt.verify(token,process.env.JWT_SECRET)
//         if(!decodeToken){
//             return res
//             .status(400)
//             .json({message:"Token not verified"})
//         }
        
//         req.userId= decodeToken.userId
//         next()
//     } catch (error) {
//         return res
//             .status(500)
//             .json({message:"Authentication Error"})
//     }
// }

import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;

