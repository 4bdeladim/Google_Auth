const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_KEY
const client = new OAuth2Client("1051253608581-t6spbonqcpcipoceb8tr57g5g4rvdmh0.apps.googleusercontent.com")


router.post('/login_google', (req, res) => {
    const { token }  = req.body ;
    client.verifyIdToken({idToken: token, audience: "1051253608581-t6spbonqcpcipoceb8tr57g5g4rvdmh0.apps.googleusercontent.com"})
        .then(async response => { 
            const { email_verified, name, email, picture} = response.payload
            const hashedPassword = await bcrypt.hash((email+name), 10)
            if(email_verified) {
                User.findOne({ email: email})
                    .then(async (user) => {
                        if(!user) {
                            const newUser = new User({
                                name: name,
                                email: email,
                                password: hashedPassword,
                                photo: picture
                            })
                            await newUser.save()
                            jwt.sign(
                                { email: newUser.email },
                                jwtKey,
                                (err, token) => {
                                    res.json({token: token, name: newUser.name})
                                }
                            )
                        }
                        if(user) {
                            jwt.sign(
                                { email: user.email },
                                jwtKey,
                                (err, token) => {
                                    res.json({token: token, name: user.name})
                                }
                            )
                        }
                    })
            }
            else {
                res.status(404)
            }
        })
})

router.post('/auth', (req, res) => {
    const token = req.body.token
    if(token) {
        const decoded = jwt.verify(token, jwtKey)
        User.findOne({email: decoded.email})
            .then(usr => res.json(usr))
    }
})
module.exports = router