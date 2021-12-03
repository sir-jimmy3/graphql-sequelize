const gql = require('graphql-tag');

module.exports = gql`
    type Book {
        id: ID!
        name: String!
        author: Author
        genre: Genre
    }
    type BookPayload {
        id: ID!
        name: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
    input UserInput {
        name: String!
        password: String!
        email: String!
    }
    input Filter {
        id: [ID]
        name: [String]
    }
    input Pagination {
        page: Int!
        items: Int!
    }
    input BookInput {
        name: String!
        authorId: ID!
        genreId: ID!
        userId: ID!
    }
    type Author {
        id: ID!
        name: String
    }
    type Genre {
        id: ID!
        name: String!
    }
    type User {
        id: ID!
        name: String!
        password: String!
        email: String!
        books: [Book]
    }
    type AuthPayload {
        token: String!
        u: User!
    }
`;