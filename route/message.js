const express = require('express');
const router = express.Router();
const {getMessage , postMessage} = require('../logic/message');

router.get('/' ,getMessage );
router.post('/',postMessage );


module.exports = router;