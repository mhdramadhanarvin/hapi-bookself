const { nanoid } = require('nanoid');
const books = require('./books');
const FailException = require('./Exceptions/FailException');
const ErrorException = require('./Exceptions/ErrorException');
const NotFoundException = require('./Exceptions/NotFoundException');

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

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  
  let bookFilter = books;
  if (name !== undefined) {
    bookFilter = books.filter(function (element) { 
      return element.name === name;
    });   
  } 
  if (reading !== undefined) {
    let readingStatus = (reading == 0) ? false : true;
    bookFilter = books.filter(function (element) { 
      return element.reading == readingStatus;
    });  
  } 
  if (finished !== undefined) {
    let finishedStatus = (finished == 0) ? false : true;
    bookFilter = books.filter(function (element) { 
      return element.finished == finishedStatus;
    }); 
  }   

  let book = bookFilter.map(function (element) {
    return {
      id: element.id,
      name: element.name,
      publisher: element.publisher
    } 
  }); 

  const response = h.response({
    status: 'success',
    data: {
      books: book
    }
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: "Buku tidak ditemukan"
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book
    }
  });

  response.code(200);
  return response;
}

const editBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
      throw new FailException("Gagal memperbarui buku. Mohon isi nama buku");
    } else if (readPage > pageCount) {
      throw new FailException("Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount");
    } else if (index === -1) {
      throw new NotFoundException("Gagal memperbarui buku. Id tidak ditemukan");
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;

  } catch (error) {
    if (error instanceof FailException) {

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;

    } else if (error instanceof NotFoundException) {

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;

    }
  }
}

const deleteBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId); 

    if (index === -1) {
      throw new NotFoundException("Buku gagal dihapus. Id tidak ditemukan");
    }

    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;

  } catch (error) {
    if (error instanceof FailException) {

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;

    } else if (error instanceof NotFoundException) {

      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;

    }
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}