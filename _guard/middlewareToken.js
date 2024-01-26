const jwt = require('jsonwebtoken');
const authMethode = require('../_Methode/_auth/auth.methode')


const middlewareToken = {
    checkTokenMiddleware: (req, res, next) => {
        const token = req.headers.authorization && authMethode.extractBearer(req.headers.authorization)
        console.log('authorization', req.headers);
        console.log('Token extrait :', token);

        if (!token) {
            return res.status(401).json({ message: 'tu es obligé d avoir un token' })

        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'bad token' })
            }
            next()
        })
    }

}

module.exports = middlewareToken