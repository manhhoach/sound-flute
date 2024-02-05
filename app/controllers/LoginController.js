const bcrypt = require('bcryptjs');
const Account = require('../models/Account');


class LoginController {

    // GET 
    show(req, res, next) {
        delete req.session.error;
        res.render('login', { name: 'Đăng nhập' });
    }
    // POST 
    async auth(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const account = await Account.findOne({ username });

        if (!account) {
            req.session.error = 'Invalid Credentials';
            return res.redirect('/login');
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            req.session.error = 'Invalid Credentials';
            return res.redirect('/login');
        }
        req.session.isAuth = true;
        req.session.username = account.username;
        res.redirect('/');
    }


}


module.exports = new LoginController();