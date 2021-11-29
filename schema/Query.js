const gql = require('graphql-tag');

module.exports = gql`
    type Query {
        authors(search: Filter, pagination: Pagination): [Author]
        books(search: Filter, pagination: Pagination): [Book]
        genres(search: Filter, pagination: Pagination): [Genre]
        users(search: Filter, pagination: Pagination): [User]
    }
`;