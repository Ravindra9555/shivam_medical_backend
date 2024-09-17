 const AsyncHandler =(requestHandler)=>{
    return async(req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err)=>{
            next(err);
        })
    }
 }
 export {AsyncHandler};
 