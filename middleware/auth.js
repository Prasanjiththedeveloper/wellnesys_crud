const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const query = {
            '_id': decoded._id,
            'tokens.token':token
        }
        const user = await User.findOne(query)
        if (!user) {
            throw new Error()
        }
        next();
    } catch (error) {
        res.status(401).send({
            status: 'Failure',
            data: null,
            message: 'Unauthorized.'
        })
    }

}

module.exports = auth;