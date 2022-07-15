const express = require('express');
const router = express.Router();
const {allMessages , postMessage} = require('../logic/message');

router.get('/' ,allMessages );
router.post('/',postMessage );


module.exports = router;