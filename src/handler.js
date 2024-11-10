const { nanoid } = require('nanoid');
const books = require('./books');



const addBookHandler = (request, h)=>{
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  
  
  if (!name){
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
   }
  if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
   }
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBooks);

  return h.response ({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data:{
        bookId: id,
    }
  }).code(201);
}

const getAllBookHandler = (request, h) => {
  // Mengambil query parameters dari request
  const { name, reading, finished } = request.query;

  // Mulai dengan semua buku yang ada
  let filteredBooks = books;

  // Filter berdasarkan 'name' (non-case sensitive)
  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // Filter berdasarkan 'reading' (0 atau 1)
  if (reading) {
    // Mengubah 'reading' dari string '0' atau '1' menjadi boolean false atau true
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter berdasarkan 'finished' (0 atau 1)
  if (finished) {
    // Mengubah 'finished' dari string '0' atau '1' menjadi boolean false atau true
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  // Mengembalikan daftar buku yang telah difilter
  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200); // Mengatur status kode menjadi 200 (OK)
};


const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan id
  const book = books.find((b) => b.id === bookId);

  // Jika buku tidak ditemukan, kembalikan status 404 dengan pesan kesalahan
  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  // Jika buku ditemukan, kembalikan detail buku dengan status 200
  return h.response({
    status: 'success',
    data: {
      book,
    },
  }).code(200);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
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

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const DeleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(bookIndex, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);

};




module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, updateBookByIdHandler, DeleteBookByIdHandler };