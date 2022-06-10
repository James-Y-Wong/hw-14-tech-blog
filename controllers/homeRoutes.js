const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all post and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = postData.map((post) => post.get({ plain: true }));

    // const blogs = [
    //   {
    //     id: 1,
    //     title: 'title1',
    //     content: 'content1',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    //   {
    //     id: 2,
    //     title: 'title2',
    //     content: 'content2',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    //   {
    //     id: 3,
    //     title: 'title3',
    //     content: 'content3',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    // ];

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
// router.get('/dashboard', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    // const blogs = [
    //   {
    //     id: 1,
    //     title: 'title1',
    //     content: 'content1',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    //   {
    //     id: 2,
    //     title: 'title2',
    //     content: 'content2',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    //   {
    //     id: 3,
    //     title: 'title3',
    //     content: 'content3',
    //     author: 'author',
    //     date: '1/17/2022',
    //   },
    // ];

    res.render('dashboard', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/create-blog', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect('/profile');
  //   return;
  // }

  res.render('create-blog', {
    logged_in: req.session.logged_in,
  });
});

router.get('/edit-blog', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect('/profile');
  //   return;
  // }

  const blogs = {
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  };

  res.render('edit-blog', {
    ...blogs,
    logged_in: req.session.logged_in,
  });
});

router.post('/edit-blog', withAuth, async (req, res) => {
  try {
    const editedBlog = await Post.create({
      ...req.body,
      userId: req.session.user_id,
    });
    res.status(200).json(editedBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/blogs/:id', async (req, res) => {
  const postData = await Post.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  });

  const blogs = postData.get({ plain: true });

  // const blogs = {
  //   id: 'id',
  //   title: 'title1',
  //   content: 'content1',
  //   author: 'author',
  //   date: '1/17/2022',
  //   comments: [
  //     {
  //       content: 'this is a comment',
  //       author: 'author',
  //       date: '1/17/2022',
  //     },
  //     {
  //       content: 'this is a comment 2',
  //       author: 'author',
  //       date: '1/17/2022',
  //     },
  //   ],
  // };

  res.render('blog-page', {
    ...blogs,
    logged_in: req.session.logged_in,
  });
});

module.exports = router;
