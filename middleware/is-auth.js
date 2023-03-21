const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Authorization header is missing');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.replace('Bearer ', '');
    return jwt.verify(token, 'somesupersecretlongsecret', (err, verifiedJwt) => {
        console.log(err);
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 401;
            throw error;
        } else {
            req.userId = verifiedJwt.userId;
            return next();
        }
    });
};

module.exports = isAuth;