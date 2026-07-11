import admin from "../config/firebaseAdmin.js";

export const verifyToken = async (req, res, next)=>{
        try{
         const authHeader = req.headers.authorization;

         if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No token provided"});
         }
         const token = authHeader.split(" ")[1];

         //VERIFY TOKEN WITH FIREBASE ADMIN
         const decodedValue = await admin.auth().verifyIdToken(token);
         req.user = decodedValue;
         next();

        }catch(error){
          console.error("Token verification failed: ", error);
          return res.status(401).json({message: "Unauthorized"});
        }
}