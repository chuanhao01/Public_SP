// This file contains controllers pertaining to:
// Everything that has to deal with error pages

const errorController = {
    init(app){
        const parent_dir = 'pages/error/';
        app.get('/error/403', function(req, res){
            res.render(parent_dir + '403', {
                'title': '403 error',
            });
        });
    }
};

module.exports = errorController;