const { nanoid } = require('nanoid');
const books = require('./books');
const FailException = require('./Exceptions/FailException');
const ErrorException = require('./Exceptions/ErrorException');

const addBookHandler = (request, h) => {
  try { 
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id, //unique
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt,
      updatedAt,
    }; 

    if (!name) {
      throw new FailException("Gagal menambahkan buku. Mohon isi nama buku"); 
    } else if (readPage > pageCount) {
      throw new FailException("Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"); 
    } 

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201); 
      return response;

    } else {
      throw new ErrorException("Buku gagal ditambahkan");
    }
    
    
  } catch (error) { 
    if (error instanceof FailException) { 

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;

    } else if (error instanceof ErrorException) {

      const response = h.response({
        status: 'error',
        message: error.message,
      });
      response.code(500);
      return response;

    }
  }
};

const getAllBooksHandler = () => {
  const { id, name, publisher } = books;
  console.log(id);
  return true;
};

module.exports = { 
  addBookHandler,
  getAllBooksHandler
}