"use client"

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoPersonSharp } from "react-icons/io5"; 
import { FaStar } from "react-icons/fa";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";
import { onAuthStateChanged } from 'firebase/auth';




export default function BookComments({id}) {
    const [viewedBook, setViewedBook] = useState(null)
    const [bookAuthor, setBookAuthor] = useState(null)
    const [CommentsCol, setCommentsCol] = useState(null)

    const [title, setTitle] = useState('')
    const [rating, setRating] = useState(0)
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [visable, setVisable] = useState(10)
    const [review, setReview] = useState(0)

    
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
                  
                  const ComRef = collection(db, "BookComments");
                  getDocs(ComRef)
                    .then((snapshot) => {
                        let comments = []
                        snapshot.docs.forEach((doc) => {
                        comments.push({ ...doc.data(), id: doc.id })
                        })
                        let commentsFiltered = comments.filter((comment) => { return comment.book === id})
                        setCommentsCol(commentsFiltered)
                        })
              })
            } else if (!user) {
                setBookView('scroll')
            }
        })
      }, [])      
        
    
    
    
    
    
      const handleSubmit = (e) => {
        setLoading(true)
        const currentBookRef = doc(db, "BookCollection", `${viewedBook.id}`);

    
        const ComRef = collection(db, "BookComments");
        addDoc(ComRef, {
          book: id,
          title: title,
          rating: rating,
          description: description,
          displayName: user.displayName,
          photoURL: user.photoURL,
          identity: 'Reader',
        }).then(() => {
          updateDoc(currentBookRef, {
              'reviews.amount': viewedBook.reviews.amount + 1,
              'reviews.total': Number(viewedBook.reviews.total) + rating,
          })
        }).then(() => {
          updateDoc(currentBookRef, {
            'reviews.average': (viewedBook.reviews.total / viewedBook.reviews.amount).toPrecision(2)
          })
          setReview(0)
          setLoading(false)
        })
      }
    
      const handleCancel = (e) => {
        setTitle('')
        setRating(0)
        setDescription('')
        setReview(0)
      }

      if (CommentsCol)
    return (
            <div className='comments-section'>
              <div className='comments-section-title'>
                <h3>Comments Section</h3>
                <h4>{CommentsCol.length} Comments</h4>
              </div>
              <div className='comments-section-main'>
                  <div className='comments-section-block'>
                    <div className='block-left'>
                      <div className='block-left-profile-picture'>
                        <Image src={user?.photoURL} className="profile-picture-icon" width={80} height={80}/>
                      </div>
                      <div className='block-left-username '>
                        <p>{user?.displayName}</p>
                      </div>
                    </div>

                    {review === 0 && <div className='block-right'>
                      <div className='block-right-bottom'>
                        <div onClick={() => setReview(1)} className='block-right-bottom-review'>
                          Review
                        </div>
                      </div>
                    </div>}

                    {review === 1 && <div className='block-right'>
                      <form>
                        <div className='block-right-top-title-review'>
                          <input
                            className='title-input'
                            type='text'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder='Title'/>
                          <div>
                            <input
                              className='rating-input'
                              type='number'
                              onChange={(e) => setRating(e.target.valueAsNumber)}
                              value={rating}
                              />
                            <span>/5</span>
                          </div>
                        </div>
                        <div className='block-right-bottom-description-review'>
                          <textarea
                              className='description-input'
                              type='text'
                              onChange={(e) => setDescription(e.target.value)}
                              value={description}
                              placeholder='Add a Comment Here!'
                              />
                          <div className='cancel-submit-section'>
                            <div className='submit' onClick={handleSubmit}>{loading ? 'Loading' : 'Submit'}</div>
                            <div className='cancel' onClick={handleCancel} >Cancel</div>
                          </div>
                        </div>
                      </form>
                    </div>}
                  </div>
                {CommentsCol && CommentsCol.map(comment => (
                  <div className='comments-section-block'>
                    <div className='block-left'>
                      <div className='block-left-profile-picture'>
                        <Image src={comment.photoURL} className="profile-picture-icon" width={80} height={80}/>
                      </div>
                      <div className='block-left-username '>
                        <p>{comment.displayName}</p>
                      </div>
                      <div>{comment.identity}</div>
                    </div>
                    <div className='block-right'>
                      <div className='block-right-top'>
                        <h3>
                          {comment.title}
                        </h3>
                        <div>
                          {comment.rating}/5 <FaStar className='author-info-icons'/>
                        </div>
                      </div>
                      <div className='block-right-bottom'>
                        <p>
                          {comment.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='show-more-button-section'>
                <div className='show-more-button' onClick={() => setVisable(prev => prev + 10)} >Show more</div>
              </div>
            </div>
  )
}
