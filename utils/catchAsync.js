module.exports = fn => {
    // This function doesnt have access to req, res,
    // and next, so you need to return it with them
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
