const {assocPath, mergeRight, pathOr} = require("ramda");

function withPagination(cb) {
    return (parent, args, ctx = {}) => {
        if (args && args.pagination) {
            const { items, page } = args.pagination;
            ctx = assocPath(['query'], mergeRight(pathOr({}, ['query'], ctx), {
                offset: items * (page - 1),
                limit: items
            }), ctx);
        }
        return cb(parent, args, ctx)
    }
}

module.exports = withPagination
