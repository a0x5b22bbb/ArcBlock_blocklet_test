const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const db = require('../libs/db');

// todo 后续研究middleware.user()的作用
router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

module.exports = router;
