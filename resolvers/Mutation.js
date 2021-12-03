const {author, book, genre, user} = require('../models');
const jsonwebtoken = require('jsonwebtoken');
const {v4} = require('uuid');
require('dotenv').config({path: '../.env'});

module.exports = {
    Mutation: {
        createAuthor: async (parent, args, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return author.create({
                id: v4(),
                ...args
            });
        },
        deleteAuthor: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [], b, authors = [];
            for (let i of id) {
                b = await book.findOne({where: {authorId: i}});
                if (b !== null) {
                    books.push(b);
                }
            }
            if (books.length >= 1) {
                throw Error('Authors cannot be deleted! To delete the authors, please delete books of the authors!');
            }
            for (let i of id) {
                authors.push(await author.findOne({where: {id: i}}));
                await author.destroy({where: {id: i}});
            }
            return authors;
        },
        createBook: async (parent, {input}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return await book.create({
                id: v4(),
                ...input
            });
        },
        deleteBook: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [];
            for (let i of id) {
                books.push(await book.findOne({where: {id: i}, include: [author, genre]}));
                await book.destroy({where: {id: i}});
            }
            return books;
        },
        createGenre: async (parent, args, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            return await genre.create({
                id: v4(),
                ...args
            });
        },
        deleteGenre: async (parent, {id}, {user}) => {
            if (!user) throw new Error('You are not authenticated!');
            let books = [], b, genres = [];
            for (let i of id) {
                b = await book.findOne({where: {genreId: i}});
                if (b !== null) {
                    books.push(b);
                }
            }
            if (books.length >= 1) {
                throw Error('Genres cannot be deleted! To delete the genres, please delete books of the genres!');
            }
            for (let i of id) {
                genres.push(await genre.findOne({where: {id: i}}));
                await genre.destroy({where: {id: i}});
            }
            return genres;
        },
        registerUser: async (parent, {input}) => {
            await user.create({
                id: v4(),
                ...input
            });

            const u = await user.findOne({
                where: {email: input.email}, include: [{
                    model: book,
                    include: [author, genre]
                }]
            });

            const token = jsonwebtoken.sign(
                {id: u.id, email: u.email},
                process.env.JWT_SECRET,
                {expiresIn: '1y'}
            );

            return {
                token,
                u
            };
        },
        deleteUser: async (parent, {id}, ctx) => {
            if (!ctx.user) throw new Error('You are not authenticated!');
            const b = await book.findOne({where: {userId: id}});
            if (b !== null) {
                throw Error('Before deleting the user, please delete books that belong to the user!');
            }
            const deletedUser = await user.findOne({
                where: {id}, include: [{
                    model: book,
                    include: [author, genre]
                }]
            });
            await user.destroy({where: {id}});
            return deletedUser;
        },
        userLogin: async (parent, {input}) => {
            const u = await user.findOne({
                where: {email: input.email}, include: {
                    model: book,
                    include: [author, genre]
                }
            });
            if (!u) throw new Error('No user with such email');
            const isValid = await user.validPassword(input.password, u.password);
            if (!isValid) throw new Error('Incorrect password');
            const token = jsonwebtoken.sign(
                {id: u.id, email: u.email},
                process.env.JWT_SECRET,
                {expiresIn: '1d'}
            )
            return {
                u,
                token
            }
        }
    }
}