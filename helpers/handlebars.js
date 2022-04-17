const Handlebars=require('handlebars');

module.exports = {

  sum: (a,b)=>a+b,

  equal: (a,b)=>{
    if(a===b){
      return true;
    }
    return false;
  }



}
