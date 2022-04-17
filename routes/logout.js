const express = require('express');
const router=express.Router();

router.get('/', (req, res)=>{
  req.session.destroy((e)=>{
      if(e)
      throw e;
      res.redirect('/');
  })
});


module.exports = router;