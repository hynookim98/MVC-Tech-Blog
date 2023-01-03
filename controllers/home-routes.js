const router = require('express').Router();

const { Post, Comment, User } = require('../models/');

// route for home page
// retrieve all posts and display to homepage if any
router.get('/', async (req, res) => {
    try{
        const post = await Post.findAll({
            include: [User],
        });

        const posts = post.map((data) => data.get({ plain: true }));

        //render all-posts handlebars
        res.render('all-posts', { posts });
    } catch(error) {
        res.status(500).json(error);
    }
});

// route for user to login (prompted)
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        // if request session is logged in - redirect user to home page '/'
        res.redirect('/');
        return;
    }

    // if user request session is not logged in - load login handlebars
    res.render('login');
});

// route for user to signup 
router.get('/signup', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    // if user session is not logged in - render signup handlebars
    res.render('signup');
});

// route to display single post 
router.get('/post/:id', async (req, res) => {
    try {
        // findByPk retrieve post by inputted id
        const postContent = await Post.findByPk(req.params.id, 
            { include: [ User, { model: Comment, include: [User],}]});
        if (postContent) {
            const post = postContent.get({ plain: true});

            res.render('single-post', { post });
        } else {
            res.status(404).end();
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;