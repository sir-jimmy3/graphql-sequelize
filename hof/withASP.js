const withAuth = require('./withAuth');
const withSearch = require('./withSearch');
const withPagination = require('./withPagination');

function withASP(cb) {
    return withAuth(withSearch(withPagination(cb)));
}

module.exports = withASP
