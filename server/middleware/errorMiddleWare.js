// 404 routes 
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(400);
    next(error);
}

const errorHandler = (error, req, res, next) => {
    if (res.headerSend) {
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "An unknown error occured"});
}

module.exports = {notFound,errorHandler}