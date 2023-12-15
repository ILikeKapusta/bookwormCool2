'use client'

import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db, storage } from '@/firebase/config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Navbar from '@/components/navbar'
import { useRouter } from 'next/navigation'

// styles
import './bookform.css'

export default function bookForm() {

    const user = auth.currentUser
    
    const router = useRouter()

    const [pages, setPages] = useState(1)
    const [genreShow, setGenreShow] = useState(false)
    const [genreOptions, setGenreOptions] = useState([])

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [blurb, setBlurb] = useState('')
    const [pageCount, setPageCount] = useState(0)
    const [img, setImg] = useState(null)
    const [pdf, setPdf] = useState(null)

    const [paramsId, setParamsId] = useState(null)
    const params = {}
    
    //bookCover + PDF Errors
    const [imgError, setImgError] = useState(null)
    const [pdfError, setPdfError] = useState(null)
    
    
    // Firebase
    const colRef = collection(db, "BookCollection");
    const reviewRef = collection(db, "BookReviewsCollection");

    const handleImgChange = (e) => {
        setImg(null)
        let selected = e.target.files[0]

        if (!selected) {
            setImgError('Please select a file')
            return
        }
        if (!selected.type.includes('image')) {
            setImgError('Selected file must be an img')
            return
        }
        if (selected.size > 5000000) {
            setImgError('file must not be larger than 500kb')
            return
        }
        setImgError(null)
        setImg(selected)
    }

    const handlePdfChange = (e) => {
        setPdf(null)
        let selected = e.target.files[0]

        if (!selected) {
            setPdfError('Please select a file')
            return
        }
        if (!selected.type.includes('pdf')) {
            setPdfError('Selected file must be an Pdf')
            return
        }
        if (selected.size > 50000000) {
            setPdfError('file must not be larger than 50mb')
            return
        }
        setPdfError(null)
        setPdf(selected)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        addDoc(reviewRef, {
            title: title,
            author: {
                author_name: author,
                author_id: user.uid,
            },
            blurb: blurb,
            pages: pageCount,
            photoURL: '',
            pdfURL: '',
            views: 0,
            reviews: {
                amount: 0,
                total: 0,
                average: 0
            },
            genres: genreOptions,
            likes: ['...'],
            dislikes: ['...'] 

        })
        .then((docRef) => {
            let BookCoverRef = ref(storage, `books/${docRef.id}/bookCover.png`)
            let PDFRef = ref(storage, `books/${docRef.id}/book.pdf`)
            updateDoc(doc(db, 'users', `${user.uid}`), {
                books: arrayUnion(docRef.id),
            })
            uploadBytes(BookCoverRef, img)
                .then(() => {
                    getDownloadURL(BookCoverRef)
                        .then((photoURL) => {
                            updateDoc(doc(db, 'BookReviewsCollection', `${docRef.id}`), {
                                photoURL: photoURL,
                            })
                            
                        })
                })
            uploadBytes(PDFRef, pdf)
                .then(() => {
                    getDownloadURL(PDFRef)
                        .then((pdfURL) => {
                            updateDoc(doc(db, 'BookReviewsCollection', `${docRef.id}`), {
                                pdfURL: pdfURL,
                            })
                        })
                })
        }).then(() => {
            router.push('/')
        })
    }

    const genreItems = ['Fiction', 'Non-fiction', 'Fantasy', 'Sci-fi', 'Dystopian', 'Action', 'Adventure', 'Mystery', 'Horror', 'Thriller', 'Historical', 'Romance', 'LGBTQ+', 'Literary', 'Young Adult', 'Short Story', 'Childrens', 'Biography', 'Memoir', 'Self-help', 'Travel', 'True Crime', 'Humor', 'How-to', 'Social Sciences', 'Parenting']


    if (typeof window !== "undefined") {
        return (
            <>
                <Navbar/>
                <div className='Container'>
                    <form className='form' onSubmit={handleSubmit}>
                        {pages === 1 && <h3 className='book-add-title'>General Information</h3>}
                        {pages === 2 && <h3 className='book-add-title'>Book Cover & PDF</h3>}
                        {pages === 3 && <h3 className='book-add-title'>Choose your Genres</h3>}
                        {pages === 1 && <div className='book-add-page-1'>
                            <div className='form-content'>
                                <label>Title:</label>
                                <input
                                    className='form-content-input'
                                    type='text' 
                                    placeholder=" Book Name..." 
                                    required 
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title} 
                                />        
                                </div>
                            <div className='form-content'>
                                <label>Author:</label>
                                <input
                                    className='form-content-input' 
                                    type='text' 
                                    placeholder=" Author..." 
                                    required
                                    onChange={(e) => setAuthor(e.target.value)}
                                    value={author}        
                                />
                            </div>
                            <div className='form-content'>
                                <label>Blurb:</label>
                                <input 
                                    className='form-content-input'
                                    type='text' 
                                    placeholder=" Blurb..." 
                                    required
                                    onChange={(e) => setBlurb(e.target.value)}
                                    value={blurb}        
                                />
                            </div>
                            <div className='form-content'>
                                <label>Total Page Number:</label>
                                <input
                                    className='form-content-input'
                                    type='number' 
                                    placeholder=" Number of Pages..." 
                                    required
                                    onChange={(e) => setPageCount(e.target.value)}
                                    value={pageCount}        
                                />
                            </div>
                            <div className='form-content'>
                                <label>ISBN (recommended)</label>
                                <input
                                    className='form-content-input'
                                    type='text' 
                                    placeholder=" ISBN Here"  
                                />        
                            </div>
                        </div>}
                        
                        {pages === 2 && 
                        <div className='book-add-page-2'>
                            <div className='form-content'>
                                <label>Book Cover</label>
                                <input
                                    type='file'  
                                    required
                                    onChange={handleImgChange}
                                />
                                {imgError && <div className='error'>{imgError}</div>}
                            </div>
                            <div className='form-content'>
                                <label>Book PDF</label>
                                <input

                                    type='file'  
                                    required
                                    onChange={handlePdfChange}
                                />
                                {pdfError && <div className='error'>{pdfError}</div>}

                            </div>
                        </div>}

                        {pages === 3 && 
                        <div className='book-add-page-3'>
                            <div className='form-content'>
                                <div className='genres-container'>
                                    <div className='genres-options'>
                                        {genreItems.map((item) => 
                                            <div className={`genre-option-item ${genreOptions.includes(item) ? 'active' : ''}`} onClick={() => genreOptions.includes(item) ? genreOptions.splice(genreOptions.indexOf(item), 1) : setGenreOptions(prev => [...prev, item])}>{item}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        
                        {pages === 1 && <button className='submit' onClick={() => setPages(2)}>Next</button>}
                        {pages === 2 && <button className='submit' onClick={() => setPages(3)}>Next</button>}
                        {pages === 3 && <button className='submit' onClick={handleSubmit}>Submit</button>}
                        <p className='book-add-page-count'>{pages}/3</p>

                    </form>
                </div>
            </>
        )}
}
