const {Op} = require("sequelize");
const {assocPath, mergeRight, pathOr, mapObjIndexed} = require("ramda");

function withSearch(cb) {
    return (parent, args, ctx = {}) => {
        if (args && args.search) {
            ctx = assocPath(['query', 'where'], mergeRight(pathOr({}, ['query', 'where'], ctx), mapObjIndexed((value) => {
                return Array.isArray(value) ? { [Op.or]: value } : value
            }, args.search)), ctx)
        }
        return cb(parent, args, ctx)
    }
}

module.exports = withSearch
