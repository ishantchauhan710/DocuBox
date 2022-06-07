const notFoundMiddleware = (req,res,next) => {
    const error = new Error("URL Not Found");
    res.status(404);
    next(error);
}

const errorHandlerMiddleware = (err,req,res,next) => {
    const statusCode = req.statusCode === 200 ? 500 : res.statusCode;
    res.status(500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {notFoundMiddleware,errorHandlerMiddleware}