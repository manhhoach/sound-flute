const homeRouter=require('./home');
const postsRouter=require('./posts');
const adminRouter=require('./admin');
const loginRouter=require('./login');
const registerRouter=require('./register');
const logoutRouter=require('./logout');


function route(app){
  
  app.use('/register',registerRouter);
  app.use('/logout', logoutRouter);
  app.use('/login', loginRouter);
  app.use('/admin',adminRouter);
  app.use('/posts',postsRouter);
  app.use('/', homeRouter);
  
}

module.exports = route;