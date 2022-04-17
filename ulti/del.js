const fs = require('fs');
module.exports=function(path){
    fs.unlink(path, err=>{
        if(err) return new Error(err);
    });
}