const {Author, Book, Genre, User} = require('../models');
const jsonwebtoken = require('jsonwebtoken');
const {v4} = require('uuid');
require('dotenv').config({path: '../.env'});

// async function withAuth(cb) {
//     return async (parent, args, ctx) => {
//         // TODO check role
//         if (!ctx || !ctx.user) throw new Error('You are not authenticated!');
//         return cb(parent, args, ctx);
//     }
// }

module.exports = {
    Mutation: {
        createAuthor: async (parent, args, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return Author.create({
                id: v4(),
                ...args
            });
        },
        deleteAuthor: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [], book, authors = [];
            for (let i of id) {
                book = await Book.findOne({where: {authorId: i}});
                if (book !== null) {
                    books.push(book);
                }
            }
            if (books.length >= 1) {
                throw Error('Authors cannot be deleted! To delete the authors, please delete books that belong to the authors!');
            }
            for (let i of id) {
                authors.push(await Author.findOne({where: {id: i}}));
                await Author.destroy({where: {id: i}});
            }
            return authors;
        },
        createBook: async (parent, {input}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return await Book.create({
                id: v4(),
                ...input
            });
        },
        deleteBook: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [];
            for (let i of id) {
                books.push(await Book.findOne({where: {id: i}, include: [Author, Genre]}));
                await Book.destroy({where: {id: i}});
            }
            return books;
        },
        createGenre: async (parent, args, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return await Genre.create({
                id: v4(),
                ...args
            });
        },
        deleteGenre: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [], book, genres = [];
            for (let i of id) {
                book = await Book.findOne({where: {genreId: i}});
                if (book !== null) {
                    books.push(book);
                }
            }
            if (books.length >= 1) {
                throw Error('Genres cannot be deleted! To delete the genres, please delete books that belong to the genres!');
            }
            for (let i of id) {
                genres.push(await Genre.findOne({where: {id: i}}));
                await Genre.destroy({where: {id: i}});
            }
            return genres;
        },
        registerUser: async (parent, {input}) => {
            await User.create({
                id: v4(),
                ...input
            });

            const user = await User.findOne({
                where: {email: input.email}, include: [{
                    model: Book,
                    include: [Author, Genre]
                }]
            });

            const token = jsonwebtoken.sign(
                {id: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1y'}
            );

            return {
                token,
                user
            };
        },
        deleteUser: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            const book = await Book.findOne({where: {userId: id}});
            if (book !== null) {
                throw Error('Before deleting the user, please delete books that belong to the user!');
            }
            const deletedUser = await User.findOne({
                where: {id}, include: [{
                    model: Book,
                    include: [Author, Genre]
                }]
            });
            await User.destroy({where: {id}});
            return deletedUser;
        },
        userLogin: async (parent, {input}) => {
            const user = await User.findOne({
                where: {email: input.email}, include: {
                    model: Book,
                    include: [Author, Genre]
                }
            });
            if (!user) throw new Error('No user with such email');
            const isValid = await User.validPassword(input.password, user.password);
            if (!isValid) throw new Error('Incorrect password');
            const token = jsonwebtoken.sign(
                {id: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1d'}
            )
            return {
                user,
                token
            }
        }
    }
}