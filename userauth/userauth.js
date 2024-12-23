


exports.isAuthenticated = (req, res, next)=>{

    if (req.session.patient) {
        return next()
    } else {
        res.status(401).json({msg: 'Please login'})

        console.log(res.msg);
        
    }
}

