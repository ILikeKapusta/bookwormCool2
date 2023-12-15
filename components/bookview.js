"use client"

import { auth, db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'next/navigation';

// Styles
import '../app/book/[id]/book.css'


export default function BookView({ id }) {
    const params = useParams()
    const [book, setBook] = useState(null)

    const getBookInfo = async (bookId) => {
        try {
          const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getBookInfo/${'fZvfYVYxwGtYQq7Sb8Vm'}`, {mode: 'no-cors'});
          
          if (!response.ok) {
            throw new Error('Failed to fetch book information');
          }
      
          const data = await response.json();
          const bookInfo = data.book;
      
          // Do something with the book information
          console.log(bookInfo);
          setBook(bookInfo)
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
      
      // Usage
      const bookId = params
      getBookInfo(bookId);


    // const [bookPDF, setBookPDF] = useState(null)
    // const [bookView, setBookView] = useState(null)
  
    // useEffect(() => {
    //   const colRef = collection(db, "BookCollection");
    //   getDocs(colRef)
    //     .then((snapshot) => {
    //       let books = []
    //       snapshot.docs.forEach((doc) => {
    //         books.push({ ...doc.data(), id: doc.id })
    //       })
    //       let Filtered = books.filter((book) => { return book.id === id })
    //       setBookPDF(Filtered[0].pdfURL)
    //     })
  
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             const UserRef = collection(db, "users");
    //             getDocs(UserRef)
    //             .then((snapshot) => {
    //                 let users = []
    //                 snapshot.docs.forEach((doc) => {
    //                 users.push({ ...doc.data(), id: doc.id })
    //                 })
    //                 let currentUser = users.filter(individualUser => individualUser.id === user?.uid)
    //                 setBookView(currentUser[0].bookView)
    //             })
    //         } else if (!user) {
    //             setBookView('scroll')
    //         }
    //     })
    // }, [])     

    if (book)
        return (
            <div className='book-reading'>
                {/* {book.bookView === 'scroll' ? <iframe id='pdf-iframe' className="myPDF" src={book.pdfURL}/> :     
                    <div className='PDFBookContainer'>
                        <iframe 
                            className='PDFBook' 
                            src="https://online.fliphtml5.com/xkquu/zmdv/"  
                            seamless="seamless" 
                            frameborder="0" 
                            allowtransparency="true" 
                            allowfullscreen="true" >
                    </iframe>
                </div>} */}
                <iframe id='pdf-iframe' className="myPDF" src={book.pdfURL}/>
            </div>
        )};
