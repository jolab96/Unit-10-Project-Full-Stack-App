// Constructing a router instance.
const express = require('express');
const router = express.Router();
//const data = require('../seed/data.json')
const User = require('../models').User;
const Course = require('../models').Course;
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs')
const auth = require('basic-auth')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// ------------------ User authentication middleware -------------------------------

const authenticateUser = async (req, res, next) => {
    let message;

    // Parsing the user's credentials from the Authorization header.

    const credentials = auth(req);
    if (credentials) {

        //Find user with matching email address

        const user = await User.findOne({
            raw: true,
            where: {
                emailAddress: credentials.name,
            },
        });
        //If user matches email
        if (user) {
            // Use the bcryptjs to compare the user's password tp the stored password

            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            //If password matches
            if (authenticated) {
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                if (req.originalUrl.includes('courses')) {
                    //If route has a courses endpoint, set request userId to matched user id
                    req.body.userId = user.id;
                } else if (req.originalUrl.includes('users')) {
                    //If route has a users endpoint, set request id to matched user id
                    req.body.id = user.id;
                }
            } else {

                message = `Authentication failed for user: ${user.firstName} ${user.lastName}`;
            }
        } else {
            // email address not found
            message = `User not found for email address: ${credentials.name}`;
        }
    } else {
        // credentials/authorization header available not found
        message = 'Authorization header not found';
    }

    if (message) {
        console.warn(message);
        const err = new Error('Access Denied');
        err.status = 401;
        next(err);
    } else {
        //User authenticated
        next();
    }
}

// ------------------------------ USER ROUTES ----------------------------------

router.get('/users', authenticateUser, async (req, res, ) => {
    const user = await User.findByPk(req.body.id)
    res.json(user)

});


router.post('/users', async (req, res, next) => {
    const user = req.body;   // Getting user from the request body
    if (user.password && user.firstName && user.lastName && user.emailAddress) {
        user.password = bcryptjs.hashSync(user.password);       //  fields exist, hash the new user's password


        await User.create(user)       // user validation
        res.location('/');            // setting location header to "/"
        res.status(201).end();        // return 201 status if successful
    } else {
        res.status(400).end();        // return 400 status if user cant be created
    }
})


// ------------------------------------ COURSES ROUTES -------------------------------

// Get route to find all courses

router.get('/courses', async (req, res, next) => {
    const course = await Course.findAll()
    res.json(course)

})

// get route to return course that the user owns

router.get('/courses/:id', async (req, res, next) => {
    try {
        const usercourse = await Course.findOne({
            where: {
                id: req.params.id
            },
        })
        if (usercourse === null) {
            res.status(404)
            res.json('No Course is Found')

        }
        else {
            res.json(usercourse)
        }
    } catch (err) {
        console.log('Error 500 - Internal Server Error')
    }
})

// post route to create course with authentication for title and description

router.post('/courses', authenticateUser, async (req, res, next) => {
    try {
        if (req.body.title && req.body.description) {
            const createCourse = await Course.create(req.body);
            res.location(`/api/courses/${createCourse.id}`) //setting location
            res.status(201).end();
        }
        else {
            res.status(400).end();

        }
    } catch (err) {
        console.log('Error 500 - Internal Server Error')
    }
})


router.delete("/courses/:id", authenticateUser, async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course.userId === req.body.userId) {
        await course.destroy();
        res.status(204).end();
    }
    else
        res.status(403).end();
})


router.put('/courses/:id', authenticateUser, async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course.userId === req.body.userId) {
        if (req.body.title && req.body.description) {
            course.update(req.body);
            res.status(204).end()
        } else {
            res.status(400).end();
        }

    } else
        res.status(403).end();
})

module.exports = router;
