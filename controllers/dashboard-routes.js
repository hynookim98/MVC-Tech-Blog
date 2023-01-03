const router = require('express').Router();
const { Post } = require('../models');
const auth = require('../utils/auth');

router.get('/', auth, async (req, res) => {
    try {
        const postData = await Post.findAll({where: {userId: req.session.userId}});

        const posts = postData.map((data) => data.get({plain: true}));

        res.render('all-posts-admin', {})
    }
})