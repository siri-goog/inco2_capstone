// Auth middleware that checks if the user is logged in
module.exports = function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
