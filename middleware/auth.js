const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', 'Session telah habis, silakan login kembali');
        req.flash('alertStatus', 'danger');
        return res.redirect('/admin/login');
    } 

    next();
};

module.exports = isLogin;