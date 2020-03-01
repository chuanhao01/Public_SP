// This file contains controllers pertaining to:
// Everything that has to deal with the creation and logging in of accounts

const accountController = {
    init(app){
        const parent_dir = 'pages/account/';
        // Account creation
        app.get('/account/create', function(req, res){
            res.render(parent_dir + 'createAccount', {
                'title': 'Create an account'
            }); 
        });
        // Login
        app.get('/login', function(req, res){
            res.render(parent_dir + 'loginAccount', {
                title: 'Login Page',
            });
        });
        // Logout
        app.get('/logout', function(req, res){
            res.render(parent_dir + 'logoutAccount', {
                'title': 'Logout'
            });
        });
    },
};

module.exports = accountController;