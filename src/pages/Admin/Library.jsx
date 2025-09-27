// Library.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
/*import {
  LibraryContainer,
  Content,
  Title,
  AddBookForm,
  FormGroup,
  Label,
  Input,
  Button,
  BookList,
  BookItem,
  BookTitle,
  BookAuthor,
  ActionButton,
} from '../../styles/LibraryStyles';*/

const Library = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/library/getall');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const addBook = async (book) => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/library/books', {
        bookname: book.title,
        author: book.author,
      });
      setBooks([...books, response.data]);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleBookPick = async (bookId, studentId) => {
    // Implement logic to record when a student picks a book
  };

  const handleBookReturn = async (bookId, studentId) => {
    // Implement logic to mark when a student returns a book
  };

  return (
    <section className="bg-orange-100">
      {/*<Sidebar />*/}
      <div className="p-4">
        <h2 className="text-2xl mb-2">Library Management</h2>
        <h3 className="text-lg mb-1">Add New Book</h3>
        <form className="inline-flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const book = {
              id: Math.random().toString(36).substr(2, 9),
              title: e.target.title.value,
              author: e.target.author.value,
            };
            addBook(book);
            e.target.reset();
          }}
        >
          <div>
            {/*<label htmlFor="title">Title:</label>*/}
            <input type="text" id="title" placeholder="Title" required />
          </div>
          <div>
            {/*<label htmlFor="author">Author:</label>*/}
            <input type="text" id="author" placeholder="Author | Publisher" required />
          </div>
          <button type="submit" className="bg-orange-400">Add Book</button>
        </form>

        <h2 className="text-lg mt-4 mb-1">Books</h2>
        <table className="border-collapse " cellPadding="5">
          {books.map((book, index) => (
            <tr key={book._id}>
              <td className="border border-orange-200">{index+1}</td>
              <td className="border border-orange-200">{book._id}</td>
              <td className="border border-orange-200">{book.bookname}</td>
              <td className="border border-orange-200">by {book.author}</td>
              {/*<td className="border border-orange-200">
                <button className="bg-orange-200 mx-1" onClick={() => handleBookPick(book._id, 'student123')}>Pick</button>
                <button className="bg-orange-200 mx-1" onClick={() => handleBookReturn(book._id, 'student123')}>Return</button>
              </td>*/}
            </tr>
          ))}
        </table>
      </div>
    </section>
  );
};

export default Library;
