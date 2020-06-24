const db = require('../db');
const Book = require('../models/book');
const request = require("supertest");
const app = require('../app');

beforeEach(async () => {
  await Book.create({
    isbn: "121221212",
    amazon_url: "https://www.amazon.com",
    author: "Roal Dahl",
    language: "en",
    pages: 234,
    publisher: "penguin",
    title: "BFG",
    year: 1983
  });
  await Book.create({
    isbn: "1323323",
    amazon_url: "https://www.amazon.com",
    author: "Walt Whitman",
    language: "en",
    pages: 456,
    publisher: "Princeton",
    title: "poems",
    year: 1999
  });
});

afterEach(async () => {
  await db.query("DELETE FROM books");
});

describe('Testing if we can add a book/ validate', () => {
  test('testing if this route works', async () => {
    const response = await request(app).post(`/books`).send({
      isbn: "919191",
      amazon_url: "https://www.amazon.com",
      author: "God",
      language: "en",
      pages: 456,
      publisher: "Princeton",
      title: "Bible",
      year: 1999
    })
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      book: {
        isbn: "919191",
        amazon_url: "https://www.amazon.com",
        author: "God",
        language: "en",
        pages: 456,
        publisher: "Princeton",
        title: "Bible",
        year: 1999
      }
    });
    const inDB = await request(app).get(`/books/${response.body.book.isbn}`);
    expect(inDB.statusCode).toEqual(200);
    expect(inDB.body.book.isbn).toEqual("919191");
  });
});

describe("Delete a book", () => {
  test("test if the delete route deletes a valid isbn", async () => {
    const response = await request(app).delete('/books/121221212');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ message: "Book deleted" });

    const inDB = await request(app).get(`/books/121221212`);
    expect(inDB.statusCode).toEqual(404);
  })

  test("test if the delete route throw error with invalid isbn", async () => {
    const response = await request(app).delete('/books/1');

    expect(response.statusCode).toEqual(404);
  });
});

describe("PUT route for a book", () => {
  test("test if the put route updates a valid book", async () => {
    const response = await request(app).put('/books/1323323').send({
      "amazon_url": "https://www.google.com",
      "author": "pineapple",
      "language": "en",
      "pages": 500,
      "publisher": "fruits",
      "title": "PUPPIES",
      "year": 2000
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      book: {
        isbn: "1323323",
        amazon_url: "https://www.google.com",
        author: "pineapple",
        language: "en",
        pages: 500,
        publisher: "fruits",
        title: "PUPPIES",
        year: 2000
      }
    })

    const inDB = await request(app).get(`/books/${response.body.book.isbn}`);
    expect(inDB.statusCode).toEqual(200);
    expect(inDB.body.book.author).toEqual("pineapple");
  });
});




