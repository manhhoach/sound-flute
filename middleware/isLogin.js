module.exports =(req,res,next)=>{
    res.locals.isLogin = req.session.isAuth;     
    next();
};