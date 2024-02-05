const bcrypt = require('bcryptjs');
const Account = require('../models/Account');
class RegisterController {

    show(req, res) {
        res.render('register');
    }

    async signup(req, res) {
        // const { username, password, repassword } = req.body;
        // if (password === repassword)
        // {
        //     let account = await Account.findOne({ username });
        //     if (account) 
        //     {
        //         console.log(account);
        //         req.session.error = "User already exists";
        //         return res.redirect("/register");
        //     }

        //     bcrypt.genSalt(10, function(err, salt) {
        //         bcrypt.hash(password, salt, function(err, hash){
        //             if(err) 
        //              return res.redirect("/register");

        //             account = new Account({
        //                 username,
        //                 password: hash
        //             }).save()
        //         })
        //     })

        //     res.redirect('/login');


        // }
        // else
        //    return res.redirect("/register");

    }

}

module.exports = new RegisterController();