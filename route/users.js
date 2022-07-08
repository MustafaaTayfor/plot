const express = require('express');
const router = express.Router();
const {getUsers , registrUser,loginUser} = require('../logic/users');

router.get('/' ,getUsers );
router.post('/',loginUser );
router.post('/',registrUser );


module.exports = router;