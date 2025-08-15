

exports.adminAuth = (req, res, next) => {
    const role=req.user.role;

    if (role !== "admin") {
        return res.status(401).send({
            success: false,
            message: 'You are not authorized to access this page.'
        })
    }
    return next();
}