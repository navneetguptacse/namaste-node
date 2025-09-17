
export function authUser(req, res, next) {
    const token = req.headers['x-api-key'];
    if(!token) {
        res.status(401).send('User not authenticated!');
    } else {
        next();
    }
}