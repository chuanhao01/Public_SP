// This file contains controllers pertaining to:
// Home pages, those that are attached to / or similar

const homeController = {
    // Function to call to intialise all routes and controlers
    init(app){
        const parent_dir = 'pages/home/';
        app.get('/', function(req, res){
            res.render(parent_dir + 'homeLandingPage', {
                'title': 'SnapSell Home page',
            });
        });
    }
};

module.exports = homeController;