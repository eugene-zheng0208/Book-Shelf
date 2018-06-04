import React from 'react'
import { Route, Link } from 'react-router-dom'
import DisplayBooks from './DisplayBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        books: [],
        query: ''
    }

    // Assign true or false to 'list' page or 'search' page
    setPage = (object, page, boolean) => {
        if (Array.isArray(object)) {
            object.map(o => {
                o[page] = boolean
            })
            return object
        } else {
            object[page] = boolean
            return object
        }
    }

    componentDidMount() {
        BooksAPI.getAll().then(books => {
            this.setState(state => ({ books: this.setPage(books, 'list', true) }))
        })
    }

    search = (query) => {
        this.setState({ query: query.trim() })
        if (query.trim() !== '') {
            BooksAPI.search(query, 20).then(books => {
                if (books) {
                    // Clear unshelved books from state
                    this.setState(state => ({ books: state.books.filter(book => book.list) }))

                    // Clear newly added books from 'search' page
                    this.setState(state => ({ books: this.setPage(state.books, 'search', false) }))
                    books.map(book => {
                        let noDupilcate = true
                        for (const b of this.state.books) {
                            if (book.id === b.id) {
                                // If the searched book has a duplicate in state, do not add the searched book to state
                                noDupilcate = false

                                // Instead, make the duplicate of the searched book display in 'search' page
                                b.search = true
                                return
                            }
                        }
                        if (noDupilcate) {
                            this.setState(state => ({ books: state.books.concat(this.setPage(book, 'search', true)) }))
                        }
                    })
                }
            })
        }
    }

    updateShelf = (books, book, shelf) => {
        BooksAPI.update(book, shelf)
        books[books.indexOf(book)].shelf = shelf

        // Display newly shelved book on 'list' page
        books[books.indexOf(book)].list = true
        return books
    }

    batchUpdateShelf = (books, shelf) => {
        for (const book of books) {
            if (book.selected === true) {
                book.selected = false
                book.shelf = shelf
                book.list = true
                BooksAPI.update(book, shelf)
            }
        }
        return books
    }

    shelfButton = (shelf, book) => {
        if (book.selected) {
            this.setState(state => ({ books: this.batchUpdateShelf(state.books, shelf).filter(book => book.shelf !== 'none' || book.search === true) }))
        } else {
            this.setState(state => ({ books: this.updateShelf(state.books, book, shelf).filter(book => book.shelf !== 'none' || book.search === true) }))
        }
    }

    // Toggle 'selected'
    updateSelect = (books, book) => {
        const beforeToggle = books[books.indexOf(book)].selected
        books[books.indexOf(book)].selected = !beforeToggle
        if (beforeToggle) {
            books[books.indexOf(book)].selected = false
        } else {
            // Include beforeToggle === undefined
            books[books.indexOf(book)].selected = true
        }
        return books
    }

    // Select book(s) by clicking on cover
    selectCover = (event, book) => {
        // Prevent refresh
        event.preventDefault()
        this.setState(state => ({ books: this.updateSelect(state.books, book) }))
    }

    render() {
        const { books, query } = this.state

        return (
            <div className="app">
                <Route exact path="/" render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Currently Reading</h2>
                                    <DisplayBooks
                                        books={books.filter(book => book.list && book.shelf === 'currentlyReading')}
                                        shelfButton={this.shelfButton}
                                        selectCover={this.selectCover}
                                        page="list"
                                    />
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <DisplayBooks
                                        books={books.filter(book => book.list && book.shelf === 'wantToRead')}
                                        shelfButton={this.shelfButton}
                                        selectCover={this.selectCover}
                                        page="list"
                                    />
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <DisplayBooks
                                        books={books.filter(book => book.list && book.shelf === 'read')}
                                        shelfButton={this.shelfButton}
                                        selectCover={this.selectCover}
                                        page="list"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="open-search">
                            <Link
                                to='/search'
                            >Add a book</Link>
                        </div>

                    </div>
                )}/>
                <Route path="/search" render={() => (
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link
                                className="close-search"
                                to='/'
                            >Close</Link>
                            <div className="search-books-input-wrapper">
                                {/*
                          NOTES: The search from BooksAPI is limited to a particular set of search terms.
                          You can find these search terms here:
                          https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                          However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                          you don't find a specific author or title. Every search is limited by search terms.
                        */}
                                <input
                                    type="text"
                                    placeholder="Search by title or author"
                                    value={query}
                                    onChange={event => this.search(event.target.value)}
                                />
                            </div>
                        </div>
                        <DisplayBooks
                            books={books.filter(book => book.search && book.imageLinks)}
                            shelfButton={this.shelfButton}
                            selectCover={this.selectCover}
                            page="search"
                        />
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp
