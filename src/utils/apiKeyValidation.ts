import { RequestHandler } from "express";
import User from "../models/userModel";

//Verify Token
export const verifyToken: RequestHandler = async(req,res,next) => {
  //Auth header value = > send token into header

  const bearerHeader = req.headers['authorization'];

  // console.log(bearerHeader);

  //check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
      // split the space at the bearer
      const bearer = bearerHeader.split(' ');
      // Get token from string
      const bearerToken = bearer[1];

      try {
        const user = await User.findOne({apiKey: bearerToken});
        if(!user){
          return res.status(401).json({
            message: "Unauthorized",
            error: "You are not authorized to access this resource, please provide a valid API key or register for one"
          })
        }

        next();
      } catch (error) {
        next(error);
      }


  }else{
      return res.status(403).json({
        message: "Forbidden",
        error: "You are not authorized to access this resource"
      });
  }

}