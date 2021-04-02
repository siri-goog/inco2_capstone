// middleware function to check for logged-in users
module.exports = function sessionChecker(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/login')
    } else {
        next();
    }    
};