"use client"

import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoPersonSharp } from "react-icons/io5"; 
import { FaStar } from "react-icons/fa";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";
import { onAuthStateChanged } from 'firebase/auth';

export default function BookAuthorInfo({id}) {
    const [viewedBook, setViewedBook] = useState(null)
    const [bookAuthor, setBookAuthor] = useState(null)
    const [currentBook, setCurrentBook] = useState(null)
    const [bookAuthorInfo, setBookAuthorInfo] = useState(null)
    
    
    const user = auth.currentUser

  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
            const colRef = collection(db, "BookCollection");
            getDocs(colRef)
            .then((snapshot) => {
                let books = []
                snapshot.docs.forEach((doc) => {
                books.push({ ...doc.data(), id: doc.id })
                })
                let Filtered = books.filter((book) => { return book.id === id })
                setViewedBook(Filtered[0])
                setBookAuthorInfo(Filtered[0].author.author_id)
            
                const UserRef = collection(db, "users");
                getDocs(UserRef)
                .then((snapshot) => {
                    let users = []
                    snapshot.docs.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id })
                    })
                    let bookAuthor = users.filter((curuser) => {return Filtered[0].author.author_id === curuser.id})
                    setBookAuthor(bookAuthor[0])
                })  
            })
          } else if (!user) {
              setBookView('scroll')
          }
      })
    }, [])    
  
  const currentBookRef = viewedBook && doc(db, "BookCollection", `${viewedBook.id}`);

  currentBookRef && onSnapshot(currentBookRef, (book) => {
    setCurrentBook(book)
  })

  const handleLike = () => {
    if (currentBook.data().dislikes.includes(`${user?.uid}`)) {
      updateDoc(currentBookRef, {
        dislikes: arrayRemove(`${user?.uid}`),
        likes: arrayUnion(`${user?.uid}`)
        })  
    } else if (currentBook.data().likes.includes(`${user?.uid}`)) {
      updateDoc(currentBookRef, {
        likes: arrayRemove(`${user?.uid}`)
      })
    } else {
        updateDoc(currentBookRef, {
          likes: arrayUnion(`${user?.uid}`)
        })        
    };
}

const handleDislike = () => {
    if (currentBook.data().likes.includes(`${user?.uid}`)) {
      updateDoc(currentBookRef, {
        likes: arrayRemove(`${user?.uid}`),
        dislikes: arrayUnion(`${user?.uid}`)
        })  
    } else if (currentBook.data().dislikes.includes(`${user?.uid}`)) {
      updateDoc(currentBookRef, {
        dislikes: arrayRemove(`${user?.uid}`)
      })
    } else {
        updateDoc(currentBookRef, {
          dislikes: arrayUnion(`${user?.uid}`)
        })        
    };
  }

    if (bookAuthor && viewedBook)
      return (
            <div className='author-info'>
              <div className='author-info-left-side'>
                <div className='author-info-left-side-top'>
                  <div className='author-info-left-side-top-profile-picture'>
                    <Image src={bookAuthor.photoURL} alt='Authors-Profile-Picture' className="profile-picture-icon" width={80} height={80}/>
                  </div>
                  <div className='author-info-left-side-top-author-name'>
                    {bookAuthor.displayName}
                  </div>
                </div>
                <div className='author-info-left-side-bottom'>
                  <div className='author-info-left-side-bottom-top'>
                    <div className='author-info-stat-top'>
                      <div className='author-info-stat-left'>
                        <div>
                          <IoPersonSharp className='author-info-icons'/> {viewedBook.views}
                        </div>
                      </div>
                      <div className='author-info-stat-right'>
                        <div>
                          {viewedBook.reviews.average} <FaStar className='author-info-icons'/>
                        </div> 
                      </div>
                    </div>
                    <div className='author-info-stat-bottom'>
                      <div className='author-info-stat-left'>
                        <div>
                          {viewedBook.likes.length} <IoIosThumbsUp className='author-info-icons'/>
                        </div>
                      </div>
                      <div className='author-info-stat-right'>
                        <div>
                          {viewedBook.dislikes.length} <IoIosThumbsDown className='author-info-icons'/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='divider'></div>
                  <div className='author-info-left-bottom-bio'>
                    <div className='middle-right'>
                      <div className='like-dislike'>
                        <div className={`like ${currentBook?.data().likes.includes(`${user?.uid}`) ? 'like-active' : ''}`} onClick={handleLike}><IoIosThumbsUp className='author-info-icons'/></div>
                        <div className={`dislike ${currentBook?.data().dislikes.includes(`${user?.uid}`) ? 'dislike-active' : ''}`} onClick={handleDislike}><IoIosThumbsDown className='author-info-icons'/></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='author-info-middle-side'>
                <p>{bookAuthor.bio}</p>
              </div>
              <div className='author-info-right-side'>
                <div className='author-info-right-side-top-side'><h3>Blurb</h3></div>
                <div className='author-info-right-side-bottom-side'>
                  {viewedBook.blurb}
                </div>
              </div>
            </div>
  )
}
