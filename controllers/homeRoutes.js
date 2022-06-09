const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    // const projectData = await Project.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name'],
    //     },
    //   ],
    // });

    // Serialize data so the template can read it
    // const projects = projectData.map((project) => project.get({ plain: true }));

    const blogs = [
      {
        title: "title1",
        content: "content1",
        author: "author",
        date: "1/17/2022"
      },
      {
        title: "title2",
        content: "content2",
        author: "author",
        date: "1/17/2022"
      },
      {
        title: "title3",
        content: "content3",
        author: "author",
        date: "1/17/2022"
      },
    ];

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// router.get('/dashboard', withAuth, async (req, res) => {
router.get('/dashboard', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    // const userData = await User.findByPk(req.session.user_id, {
    //   attributes: { exclude: ['password'] },
    //   include: [{ model: Project }],
    // });

    // const user = userData.get({ plain: true });

    const blogs = [
      {
        title: "title1",
        content: "content1",
        author: "author",
        date: "1/17/2022"
      },
      {
        title: "title2",
        content: "content2",
        author: "author",
        date: "1/17/2022"
      },
      {
        title: "title3",
        content: "content3",
        author: "author",
        date: "1/17/2022"
      },
    ];

    res.render('dashboard', {
      blogs,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
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
    logged_in: true,
  });
});

router.get('/edit-blog', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect('/profile');
  //   return;
  // }

  const blogs = {
    id: "id",
    title: "title1",
    content: "content1",
    author: "author",
    date: "1/17/2022",
  }

  res.render('edit-blog', {
    ...blogs,
    logged_in: true,
  });
});

router.get('/blogs/:id', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect('/profile');
  //   return;
  // }

  const blogs = {
    id: "id",
    title: "title1",
    content: "content1",
    author: "author",
    date: "1/17/2022",
    comments: [
      {
        content: "this is a comment",
        author: "author",
        date: "1/17/2022",
      },
      {
        content: "this is a comment 2",
        author: "author",
        date: "1/17/2022",
      },
    ]
  };

  res.render('blog-page', {
    ...blogs,
    logged_in: true,
  });
});

module.exports = router;
