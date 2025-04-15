export default function authMiddleware(req) {
    req.headers = {
        ...req.headers,
        Authorization: 'Bearer your_token_here',
    };
    return req;
}
