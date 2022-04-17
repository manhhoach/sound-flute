 const shareFacebook = require('share-facebook')
const FB=require('fb')
 module.exports=(redirect_uri, url, app_id)=> {

   
    //let HREF=`http://${req.headers.host}${req.originalUrl}`;
    const data= shareFacebook({
      quote: 'Check this library to help you create share facebook url',
      href: url,
      redirect_uri: redirect_uri, // web của mình
      app_id: app_id
    })
    return data;



var attachedFile={

    picture: 'YOUR IMGAGE PATH',
    link: 'Set link that you want to open by clicking on image',
    description: 'Brief description about app'
    
};


}



