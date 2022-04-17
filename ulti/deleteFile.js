const fs = require('fs');

module.exports = function(arr){
    arr.forEach((el)=>{
        fs.unlink( `public${el}`, err=>{
            if(err) return new Error(err);
        });
    });

}

