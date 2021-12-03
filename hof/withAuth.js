function withAuth(cb) {
    return (parent, args, ctx) => {
        // TODO check role
        if (!ctx || !ctx.user) throw new Error('You are not authenticated!');
        return cb(parent, args, ctx);
    }
}

module.exports = withAuth

// Modules lowercase
// Pagination: add total, pages
// HOFS
