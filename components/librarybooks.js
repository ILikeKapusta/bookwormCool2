
import { arrayRemove, collection, doc, getDoc, getDocs, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { FaFlag, FaStar } from 'react-icons/fa';
import { FaRegTrashCan } from "react-icons/fa6";


// styles
import './librarybooks.css'
import { IoPersonSharp } from 'react-icons/io5';
import { useRouter } from 'next/navigation';


export default function LibraryBooks() {
    const [favbooks, setFavBooks] = useState({})
    const [books, setBooks] = useState(null)
    const [user, setUser] = useState(null)

    const firebaseUser = auth.currentUser
    const router = useRouter()
    
    
    

    useEffect(() => {      
      getDocs(collection(db, 'BookCollection'))
        .then((snapshot) => {
          let results = [];
          snapshot.docs.forEach(doc => {
            results.push({id: doc.id, ...doc.data()})
          })
          setBooks(results)
        })

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const UserRef = collection(db, "users");
                getDocs(UserRef)
                .then((snapshot) => {
                    let users = []
                    snapshot.docs.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id })
                    })
                    let filteredLib = users.filter(individualUser => individualUser.id === user.uid)
                    setFavBooks(filteredLib[0].tagged)
                })
            } else if (!user) {
                router.push('/register')
            }
        })
    }, [])

    const FilteredBooks = books && books.filter((book) => { return favbooks.includes(book.id) })

    const handleTagged = async (book) => {
        await updateDoc(doc(db, 'users', `${firebaseUser.uid}`), {
            tagged: arrayRemove(book.id)
        })
    }

    const handleViewCount = async (book) => {
        await updateDoc(doc(db, 'BookCollection', `${book.id}`), {
            views: book.views + 1
        }) 
    }

    if (FilteredBooks && FilteredBooks.length > 0) {
        return (
            FilteredBooks.map(book => (
                <div key={book.id} className="individual-books">
                <div className="additional-information">
                    <div className="title-of-book-section">
                        <div className='title-of-book'>
                            <Link onClick={() => handleViewCount(book)} href={`/book/${book.id}`} as={`/book/${book.id}`}>{book.title}</Link>
                        </div>
                        <div className='tagged-flag' onClick={() => handleTagged(book)}><FaRegTrashCan className='react-icon flag'/></div>
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
                </div>
                <div className="individual-books-top">
                    <img src={book.photoURL} alt={book.title} />
                </div>
                <div className="individual-books-bottom">
                    <Link onClick={() => handleViewCount(book)} className="Book-Footer" href={`/book/${book.id}`}>
                        <p className="Book-Footer">{book.title}</p>
                    </Link>
                    <div className='books-bottom-section'>
                        <div className='books-bottom-left' ><IoPersonSharp className='react-icon'/> {book.views}</div>
                        <div className='books-bottom-right' >{book?.reviews?.average ? book.reviews.average : '0'} <FaStar className='react-icon star'/></div>
                    </div>
                    
                </div>
            </div>
            ))
        );
    } else {
        return (
            <div className='no-book-error-container'>
                <p className='no-book-error'>No books have been added.</p>
            </div>
        )
    }
          
};