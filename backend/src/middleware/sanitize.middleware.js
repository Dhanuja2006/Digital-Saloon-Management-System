/**
 * Custom NoSQL injection prevention middleware
 * Recursively removes any keys starting with '$' from req.body, req.query, and req.params
 * Compatible with Express 5+ where req.query is a getter
 */
const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$')) {
                delete obj[key];
            } else {
                sanitize(obj[key]);
            }
        }
    }
};

export const nosqlSanitize = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    
    // For Express 5, we can't delete from the query object directly if it's protected,
    // but we can sanitize its properties.
    if (req.query) {
        for (const key in req.query) {
            if (key.startsWith('$')) {
                delete req.query[key];
            } else if (typeof req.query[key] === 'object') {
                sanitize(req.query[key]);
            }
        }
    }
    
    next();
};
