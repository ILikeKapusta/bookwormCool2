
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import Link from 'next/link'
import { IoPersonSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaFlag, FaRegFlag } from "react-icons/fa6";


// styles
import './renderreviewbooks.css'

export default function ReviewBookList({ query, search, genreOptions}) {
    const currentUser = auth.currentUser
    const [books, setBooks] = useState(null)
    const [popup, setPopup] = useState(false)

    useEffect(() => {      
      getDocs(query)
        .then((snapshot) => {
          let results = [];
          snapshot.docs.forEach(doc => {
            results.push({id: doc.id, ...doc.data()})
          })
          setBooks(results)
        })
    }, [query])

    const handleTagged = async (book) => {
        setPopup(true)
        await updateDoc(doc(db, 'users', `${currentUser.uid}`), {
            tagged: arrayUnion(book.id)
            }).then(() => {
                setTimeout(() => {
                    setPopup(false)
                }, 2000)
            })
    }
    
    const handleViewCount = async (book) => {
        await updateDoc(doc(db, 'BookCollection', `${book.id}`), {
            views: book.views + 1
        }) 
    }


    return (
        books && books.filter((book)=> {return search ? book.title.toLowerCase().includes(search) : book}).filter((book) => {return genreOptions ? book.genres.includes(genreOptions) : book}).map(book => (
            <div key={book.id} className="individual-books">
                <div className="additional-information">
                    <div className="title-of-book-section">
                        <div className='title-of-book'>
                            <Link onClick={() => handleViewCount(book)} href={`/bookreview/book/${book.id}`} as={`/bookreview/book/?id=${book.id}`}>{book.title}</Link>
                        </div>
                        <div className='tagged-flag' onClick={() => handleTagged(book)}><FaFlag className='react-icon flag'/></div>
                    </div>
                    <div className="author-of-book">
                        <p>{book.author.author_name || book.author}</p>
                    </div>
                    <div className="blurb-about-book">
                        <p>{book.blurb}...</p>
                    </div>
                    <div className="page-number">
                        <p>{book.pages} pages</p>
                    </div>
                    {popup && <div className='my-library-popup-section'>
                        <div className='my-library-popup'>Book Added to My Library</div>
                    </div>}
                </div>
                <div className="individual-books-top">
                    <img src={book.photoURL} alt={book.title} />
                </div>
                <div className="individual-books-bottom">
                    <Link onClick={() => handleViewCount(book)} className="Book-Footer" href={`/bookreview/book/?id=${book.id}`}>
                        <p className="Book-Footer">{book.title}</p>
                    </Link>
                    <div className='books-bottom-section'>
                        <div className='books-bottom-left' ><IoPersonSharp className='react-icon'/> {book.views}</div>
                        <div className='books-bottom-right' >{book?.reviews?.average ? book.reviews.average : '0'} <FaStar className='react-icon star'/></div>
                    </div>
                </div>
            </div>
            )
    ));
};