const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            // req.session.password = newUser.password;
            req.session.loggedIn = true;

            res.status(200).json({ message: 'You have created an account.'});
            res.json(newUser);
        });
    } catch(err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            // find user based on entered username
            where: {
                username: req.body.username,
            },
        });

        // if username does not exist
        if(!user) {
            res.status(400).json({ message: 'No user account with selected username found. '});
            return;
        }

        const validPassword = user.checkPassword(req.body.password);

        // if password is wrong
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect Password. "});
            return;
        }

        res.session.save(() => {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.loggedIn = true;

            res.json({ user, message: 'You are logged in. '});
        });
    } catch(err) {
        res.status(400).json({ message: 'Incorrect login credentials. No account found.'});
    }
});

router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;