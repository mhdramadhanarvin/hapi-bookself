const {
  addBookHandler,
  getAllBooksHandler,
  // getNoteByIdHandler,
  // editNoteByIdHandler,
  // deleteNoteByIdHandler
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: () => {}
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: () => {}
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: () => {}
  },
];

module.exports = routes;