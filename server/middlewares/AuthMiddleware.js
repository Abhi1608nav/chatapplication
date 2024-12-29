import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res,next)=>{

    // console.log(req.cookies);
    const token = req.cookies.jwt;
    if(!token)
    {
        return res.status(401).send("You are not authenticated");
    }
    // console.log({token});
    const user = await jwt.verify(token,process.env.JWT_SECRET,async(err,payload)=>{ 
        if(err)
        {
            return response.status(403).send('Token is not valid');

        }
        req.userId = payload.userId
        // console.log(payload);
        next();
    })
    // console.log(user);
    
    // next()

}