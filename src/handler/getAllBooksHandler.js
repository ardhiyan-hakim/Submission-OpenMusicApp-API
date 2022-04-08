const { fullBooks } = require('../books');

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  if (reading == 0) {
    const doneReadingBooks = fullBooks.filter((item) => item.reading == false);

    const books = doneReadingBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (reading == 1) {
    const stillReadingBooks = fullBooks.filter((item) => item.reading == true);

    const books = stillReadingBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (finished == 0) {
    const notFinishedBooks = fullBooks.filter((item) => item.finished == false);

    const books = notFinishedBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (finished == 1) {
    const FinishedBooks = fullBooks.filter((item) => item.finished == true);

    const books = FinishedBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (name !== undefined) {
    const dicodingBooks = fullBooks.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));

    const books = dicodingBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });

    response.code(200);
    return response;
  }

  const books = fullBooks.map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

module.exports = { getAllBooksHandler };
