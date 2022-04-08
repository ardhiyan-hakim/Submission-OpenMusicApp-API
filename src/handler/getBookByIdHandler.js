const { fullBooks } = require('../books');

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = fullBooks.filter((thisBook) => thisBook.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { getBookByIdHandler };
