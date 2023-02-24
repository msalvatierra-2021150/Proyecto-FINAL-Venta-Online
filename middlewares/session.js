const session = require('express-session');
const { Router } = require('express');

const router = Router();

router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cart: []
}));

module.exports = router;