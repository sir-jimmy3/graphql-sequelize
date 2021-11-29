const {Author, Book, User, Genre} = require('../models');
const {Op} = require("sequelize");

const queryCheck = function(search, pagination, user) {
    if (!user) throw new Error('You are not authenticated!');
    let query = {
        offset: 0,
        limit: 5,
        where: {}
    };
    if (pagination) {
        query.limit = pagination.items;
        query.offset = pagination.items*(pagination.page-1);
    }
    if (search) {
        search.id? query.where.id = {[Op.or]: search.id} :null;
        search.name? query.where.name = {[Op.or]: search.name} :null;
    }
    return query
}

module.exports = {
    Query: {
        authors: async (parent, {search, pagination}, {user}) => {
            const query = queryCheck(search, pagination, user)
            return await Author.findAll({
                where: query.where,
                offset: query.offset,
                limit: query.limit
            });
        },
        books: async (parent, {search, pagination}, {user}) => {
            const query = queryCheck(search, pagination, user)
            return await Book.findAll({include: [Author,Genre]}, {
                where: query.where,
                offset: query.offset,
                limit: query.limit
            })
        },
        genres: async (parent, {search, pagination}, {user}) => {
            const query = queryCheck(search, pagination, user)
            return await Genre.findAll({
                where: query.where,
                offset: query.offset,
                limit: query.limit
            });
        },
        users: async (parent, {search, pagination}, {user}) => {
            const query = queryCheck(search, pagination, user);
            return await User.findAll({
                include: [{
                    model: Book,
                    include: [Author, Genre]
                }],
                offset: query.offset,
                limit: query.limit,
                where: query.where
            });
        }
    },
}
