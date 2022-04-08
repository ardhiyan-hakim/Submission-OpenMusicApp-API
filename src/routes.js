const { addBookHandler } = require('./handler/addBookHandler');
const { getAllBooksHandler } = require('./handler/getAllBooksHandler');
const { getBookByIdHandler } = require('./handler/getBookByIdHandler');
const { editBookByIdHandler } = require('./handler/editBookByIdHandler');
const { deleteBookByIdHandler } = require('./handler/deleteBookByIdHandler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
