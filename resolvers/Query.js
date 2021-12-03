const {author, book, user, genre} = require('../models');
const withASP = require('../hof/withASP');

module.exports = {
    Query: {
        authors: withASP(async (parent, {pagination}, {query,res}) => {
            const { count, rows } = await author.findAndCountAll(query)
            const pages = pagination ? Math.ceil(count / pagination.items) : null;
            res.header({"author-pagination-total": count, "author-pagination-pages": pages});
            return rows;
        }),
        genres: withASP(async (parent, {pagination}, {query,res}) => {
            const { count, rows } = await genre.findAndCountAll(query)
            const pages = pagination ? Math.ceil(count / pagination.items) : null;
            res.header({"genre-pagination-total": count, "genre-pagination-pages": pages});
            return rows;
        }),

        books: withASP(async (parent, {pagination}, {query, res}) => {
            const { count, rows } = await book.findAndCountAll({
                ...query,
                include: [author,genre],
            })
            const pages = pagination ? Math.ceil(count / pagination.items) : null;
            res.header({"book-pagination-total": count, "book-pagination-pages": pages});
            return rows;
        }),

        users: withASP(async (parent, {pagination}, {query, res}) => {
            const { count, rows } = await user.findAndCountAll({
                ...query,
                include: [{
                    model: book,
                    include: [author, genre]
                }],
            });
            const pages = pagination ? Math.ceil(count / pagination.items) : null;
            res.header({"user-pagination-total": count, "user-pagination-pages": pages});
            return rows;
        })
    },
}
