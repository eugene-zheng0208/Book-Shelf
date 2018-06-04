import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class DisplayBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        shelfButton: PropTypes.func.isRequired,
        selectCover: PropTypes.func.isRequired,
        page: PropTypes.string.isRequired,
    }

    render() {
        const books = this.props.books
        const shelfButton = this.props.shelfButton
        const selectCover = this.props.selectCover
        const page = this.props.page

        const pageClass = classNames({
            'bookshelf-books' : page === 'list',
            'search-books-results' : page === 'search',
        })

        return (
            <div className={pageClass}>
                <ol className="books-grid">
                    {books.map(book => {
                        const coverClass = classNames('book-cover', { 'selected': book.selected })
                        const buttonClass = classNames('book-shelf-changer', { 'none': !book.list || book.shelf === 'none' })
                        return (
                        <li key={book.id}>
                            <div className="book">
                                <div className="book-top">
                                    <a
                                        href="#"
                                        onClick={event => selectCover(event, book)}
                                        className={coverClass}
                                        style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}
                                    ></a>
                                    <div className={buttonClass}>
                                        <select value={book.shelf} onChange={event => shelfButton(event.target.value, book)}>
                                            <option value="move" disabled>Move to...</option>
                                            {page === 'search' && (
                                                <option value="none">None</option>
                                            )}
                                            <option value="currentlyReading">Currently Reading</option>
                                            <option value="wantToRead">Want to Read</option>
                                            <option value="read">Read</option>
                                            {page === 'list' && (
                                                <option value="none">None</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors && book.authors.join(', ')}</div>
                            </div>
                        </li>
                    )})}
                </ol>
            </div>
        )
    }
}

export default DisplayBooks

