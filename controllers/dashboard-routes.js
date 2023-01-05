const router = require('express').Router();
const { Post } = require('../models');
const auth = require('../utils/auth');

router.get('/', auth, async (req, res) => {
    try {
        const postData = await Post.findAll({where: {userId: req.session.userId}});

        const posts = postData.map((data) => data.get({plain: true}));

        res.render('all-posts-admin' {
            layout: 'dashboard',
            posts,
        });
    } catch(err) {
        res.redirect('login');
    }
});

router.get('/new', auth, async (req, res) => {
    res.render('new-post', {
        layout: 'dashboard',
    });
});

router.get('/edit/:id', auth, async (req, res) => {
    try{
        const postData = await Post.findByPk(req.params.id);
        if(postData) {
            const post = postData.get({ plain: true });
            res.render('edit-post', {
                layout: 'dashboard',
                post,
            });
            // if id doesn't exist end()
        } else {
            res.status(404).end();
        }
    } catch(err) {
        // if user is not logged in or if logged in session timed out
        res.redirect('login');
    }
});

module.exports = router;