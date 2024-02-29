const express = require('express')
const bcrypt = require('bcrypt')

const router = new express.Router()
const User = require('../models/user.model')

router.post('/api/users/signup', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({email:req.body.email})
        if(existingUser) {
            return res.status(400).json({
                status: 'Failure',
                data:{},
                message: 'User already exists with same email'
            })  
        } 
        const user = new User(req.body)
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).json({
            status: 'success',
            data: { user, token },
            message: 'User Created'
        })

    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post('/api/users/signin', async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if (!user) {
            return res.status(401).json({
                status: 'Failure',
                data: {},
                message: 'Invalid email or password'
            })
            
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'Failure',
                data: {},
                message: 'Invalid email or password'
            });
          }
        const token = await user.generateAuthToken()
        res.json({
            status: 'Success',
            data: { user, token },
            message: 'Authorized'
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router;
