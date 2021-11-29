const gql = require('graphql-tag');

module.exports = gql`
    type Mutation {
        createAuthor(name: String!): Author!
        deleteAuthor(id: [ID!]): [Author!]
        createBook(input: BookInput!): BookPayload!
        deleteBook(id: [ID!]): [Book!]
        createGenre(name: String!): Genre!
        deleteGenre(id: [ID!]): [Genre!]
        registerUser(input: UserInput!): AuthPayload!
        deleteUser(id: ID!): User!
        userLogin(input: LoginInput!): AuthPayload!
    }
`;