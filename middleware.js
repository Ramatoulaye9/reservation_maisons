const jwt = require('jsonwebtoken');
// const SECRET_KEY='secret_jwt_key';

const authMiddleware=(req,res,next)=>{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({message: 'Accès refusé, token manquant!'});

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; //On ajoute l'utilisateur au req
        next();
    } catch (error) {
        res.status(401).json({message: 'Token invalide!'});
    }
};

module.exports = authMiddleware;