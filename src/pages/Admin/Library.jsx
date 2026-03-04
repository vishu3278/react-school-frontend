// Library.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    title: '',
    author: '',
    className: '',
    price: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchClasses();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/v1/library/getall');
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/class/getall');
      if (response.data && Array.isArray(response.data.classes)) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error('Error fetching classes for dropdown:', error);
    }
  };

  const addBook = async ({ title, author, className, price }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/library/books', {
        bookname: title,
        author,
        className,
        price,
      });
      const raw = response.data;
      const createdBook = raw?.book ?? raw;

      if (!createdBook) {
        throw new Error('Invalid create book response');
      }

      setBooks((prev) => {
        if (Array.isArray(prev)) {
          return [...prev, createdBook];
        }
        return [createdBook];
      });
      toast.success('Book added');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error adding book');
    }
  };

  const startEditing = (book) => {
    setEditingId(book._id);
    setEditingValues({
      title: book.bookname || '',
      author: book.author || '',
      className: book.className || '',
      price: book.price != null ? String(book.price) : '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValues({
      title: '',
      author: '',
      className: '',
      price: '',
    });
  };

  const handleEditChange = (field, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBookRow = async () => {
    if (!editingId) return;

    const { title, author, className, price } = editingValues;
    if (!title.trim() || !author.trim()) {
      toast.error('Title and author are required');
      return;
    }

    const numericPrice = parseFloat(price);

    try {
      const response = await axios.put('http://localhost:4000/api/v1/library/books/update', {
        id: editingId,
        bookname: title.trim(),
        author: author.trim(),
        className: className.trim(),
        price: Number.isNaN(numericPrice) ? undefined : numericPrice,
      });

      const updatedBook = response.data?.book;
      if (!response.data?.success || !updatedBook) {
        toast.error(response.data?.message || 'Failed to update book');
        return;
      }

      setBooks((prev) =>
        Array.isArray(prev)
          ? prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
          : prev
      );
      toast.success('Book updated');
      cancelEditing();
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book');
    }
  };

  const handleBookPick = async (bookId, studentId) => {
    // Implement logic to record when a student picks a book
  };

  const handleBookReturn = async (bookId, studentId) => {
    // Implement logic to mark when a student returns a book
  };

  return (
    <section className="flex bg-orange-50 min-h-[calc(100vh-4rem)]">
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>

      <div className="w-full max-w-8xl p-4">
        <div className="flex items-center gap-2 mb-4">
<span className="w-2 h-10 bg-orange-500 rounded-full"></span>
        <h2 className="box-title ">Library Management</h2>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">

          <h3 className="text-lg font-semibold mb-2">Add New Book</h3>
          <form
            className="inline-flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const title = e.target.title.value.trim();
              const author = e.target.author.value.trim();
              const className = e.target.className.value.trim();
              const priceValue = e.target.price.value;
              const price = parseFloat(priceValue);
              
              if (!title || !author) {
                return;
              }
              
              addBook({
                title,
                author,
                className,
                price: Number.isNaN(price) ? undefined : price,
              });
              e.target.reset();
            }}
            >
            <div>
              {/*<label htmlFor="title">Title:</label>*/}
              <input type="text" id="title" placeholder="Title" required className="border px-2 py-1" />
            </div>
            <div>
              {/*<label htmlFor="author">Author:</label>*/}
              <input type="text" id="author" placeholder="Author | Publisher" required className="border px-2 py-1" />
            </div>
            <div>
              <select id="className" defaultValue="" className="border px-2 py-1">
                <option value="">Select Class</option>
                {Array.isArray(classes) &&
                  classes.map((cls) => (
                    <option key={cls._id ?? cls.grade} value={cls.grade}>
                      {cls.grade}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                id="price"
                placeholder="Price"
                min="0"
                step="0.5"
                className="border px-2 py-1"
                />
            </div>
            <button type="submit" className="bg-orange-300 font-medium px-4 py-2 rounded-lg">Add Book</button>
          </form>
                </div>

          <h2 className="text-lg font-semibold mt-4 mb-1">Books</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Search by title, author, or class"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-2 py-1"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-2 py-1"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="className">Sort by Class</option>
            </select>
          </div>
          {loading && <p>Loading books...</p>}
          {!loading && Array.isArray(books) && books.length === 0 && (
            <p>No books added yet.</p>
          )}
          {(() => {
            const term = searchTerm.trim().toLowerCase();
            const filtered = Array.isArray(books)
              ? books.filter((book) => {
                  const title = String(book.bookname || '').toLowerCase();
                  const author = String(book.author || '').toLowerCase();
                  const cls = String(book.className || '').toLowerCase();
                  if (!term) return true;
                  return (
                    title.includes(term) ||
                    author.includes(term) ||
                    cls.includes(term)
                  );
                })
              : [];

            const sorted = [...filtered].sort((a, b) => {
              const getField = (book) => {
                if (sortBy === 'author') return String(book.author || '');
                if (sortBy === 'className') return String(book.className || '');
                return String(book.bookname || '');
              };
              return getField(a).localeCompare(getField(b));
            });
            return (
              <table className="border-collapse bg-white w-full" cellPadding="5">
                <thead>
                  <tr>
                    <th className="border border-orange-200">#</th>
                    <th className="border border-orange-200">ID</th>
                    <th className="border border-orange-200">Title</th>
                    <th className="border border-orange-200">Author</th>
                    <th className="border border-orange-200">Class</th>
                    <th className="border border-orange-200">Price</th>
                    <th className="border border-orange-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((book, index) => {
                    const isEditing = editingId === book._id;
                    return (
                      <tr key={book._id ?? index}>
                        <td className="border border-orange-200">{index + 1}</td>
                        <td className="border border-orange-200">{book._id}</td>
                        <td className="border border-orange-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingValues.title}
                              onChange={(e) =>
                                handleEditChange('title', e.target.value)
                              }
                              className="border px-1 py-0.5 w-full"
                            />
                          ) : (
                            book.bookname
                          )}
                        </td>
                        <td className="border border-orange-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingValues.author}
                              onChange={(e) =>
                                handleEditChange('author', e.target.value)
                              }
                              className="border px-1 py-0.5 w-full"
                            />
                          ) : (
                            <>by {book.author}</>
                          )}
                        </td>
                        <td className="border border-orange-200">
                          {isEditing ? (
                            <select
                              value={editingValues.className}
                              onChange={(e) =>
                                handleEditChange('className', e.target.value)
                              }
                              className="border px-1 py-0.5 w-full"
                            >
                              <option value="">Select Class</option>
                              {Array.isArray(classes) &&
                                classes.map((cls) => (
                                  <option
                                    key={cls._id ?? cls.grade}
                                    value={cls.grade}
                                  >
                                    {cls.grade}
                                  </option>
                                ))}
                            </select>
                          ) : book.className && book.className.trim() ? (
                            book.className
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="border border-orange-200">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingValues.price}
                              onChange={(e) =>
                                handleEditChange('price', e.target.value)
                              }
                              className="border px-1 py-0.5 w-full"
                              min="0"
                              step="0.5"
                            />
                          ) : book.price != null ? (
                            book.price
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="border border-orange-200">
                          {isEditing ? (
                            <>
                              <button
                                className="bg-orange-300 px-2 py-1 mr-1"
                                type="button"
                                onClick={updateBookRow}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-200 px-2 py-1"
                                type="button"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="hover:bg-orange-100 transition-colors px-2 py-1"
                              type="button"
                              onClick={() => startEditing(book)}
                            >
                              ✏️
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        
        <ToastContainer />
      </div>
    </section>
  );
};

export default Library;
