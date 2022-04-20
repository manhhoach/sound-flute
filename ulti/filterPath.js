
module.exports = (str)=>{
  var arrayPath=[];
  while(1)
  {    
    var index = str.indexOf('/img-upload');
    if(index===-1) 
     break;

    var end = index;
    while(1)
    {
      if(str[end] === '"')
        break;
      end++;
    }
    var x = str.slice(index, end);
    arrayPath.push(x);
    str = str.replace(x, 'deleted');  
  }
  return arrayPath;

}