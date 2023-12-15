"use client"

import Navbar from '@/components/navbar';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useEffect, useState } from 'react';

// Styles
import './reviewbook.css'
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

export default function Book() {

  const [book, setBook] = useState(null)
  const [author, setAuthor] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [comments, setComments] = useState(null)
  const [review, setReview] = useState(0)

  const user = auth.currentUser
  const router = useRouter()

  const [paramsId, setParamsId] = useState(null)

  const params = {}

  useEffect(() => {
    params.id = window.location.search.split('=')[1]
    setParamsId(params.id)

    const getUserInfo = async () => {
      try {
        const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getUserInfo/`, { cache: 'force-cache' });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }
    
        const data = await response.json();
        const authorInfo = data.users;
        onAuthStateChanged(auth, (user) => {
          if (user) {
            let filteredUser = authorInfo.filter((curuser) => {return curuser.id === user.uid});
            setCurrentUser(filteredUser[0])
          } else if (!user) {
            setCurrentUser(null)
          }
        })
        let filteredAuthor = authorInfo.filter((user) => user.books.includes(params.id));
        setAuthor(filteredAuthor[0]);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    // Usage
    getUserInfo();
    
    const getReviewBookInfo = async () => {
      try {
        const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getReviewBookInfo/${params.id}`, { cache: 'force-cache' });
  
        if (!response.ok) {
          throw new Error('Failed to fetch book information');
        }
    
        const data = await response.json();
        const bookInfo = data.book;
    
        setBook(bookInfo);
  
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    // Usage
    getReviewBookInfo(params.id);
  }, [])     

 
  const handleBookReviewAccept = () => {
    setDoc(doc(db, 'BookCollection', `${paramsId}`), {
      title: book.title,
      author: {
          author_name: book.author.author_name,
          author_id: book.author.author_id
      },
      blurb: book.blurb,
      pages: book.pages,
      photoURL: book.photoURL,
      pdfURL: book.pdfURL,
      views: 0,
      reviews: {
          amount: 0,
          total: 0,
          average: 0
      },
      genres: book.genres,
      likes: ['...'],
      dislikes: ['...']
  }).then(() => {
    deleteDoc(doc(db, "BookReviewsCollection", paramsId))
    router.push('/')
  })
  }

  const handleBookReviewDecline = () => {
    deleteDoc(doc(db, "BookReviewsCollection", paramsId))
    router.push('/')
  }
  
  if (book && user) {
    return (
    <>
      <main>
        <Navbar />
        <div  className="hero">
          <div className='main-section'>
            <div className='book-reading'>
              {currentUser?.bookView === 'scroll' ? <iframe id='pdf-iframe' className="myPDF" src={book && book.pdfURL}/> :     
              <div className='PDFBookContainer'>
                <iframe 
                  className='PDFBook' 
                  src="https://online.fliphtml5.com/xkquu/zmdv/"  
                  seamless="seamless" 
                  frameborder="0" 
                  allowtransparency="true" 
                  allowfullscreen="true" >
                </iframe>
              </div>}
            </div>
            <div className='bookreview-section'>
              {user.uid === 'YKtzZ97DJuafT9CTsJ6Vwxqwxr92' && <div className='book-review-accept' onClick={handleBookReviewAccept}>Accept</div>}
              {user.uid === 'YKtzZ97DJuafT9CTsJ6Vwxqwxr92' && <div className='book-review-decline' onClick={handleBookReviewDecline}>Decline</div>}
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
  }
    
}