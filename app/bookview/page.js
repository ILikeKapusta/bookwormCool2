"use client"

import Navbar from '@/components/navbar';
import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { IoIosThumbsDown, IoIosThumbsUp } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';

// Styles
import './book.css'


export default function Book() {
  
  const [book, setBook] = useState(null)
  const [author, setAuthor] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [comments, setComments] = useState(null)
  const [review, setReview] = useState(0)

  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [visable, setVisable] = useState(10)
  const [currentBook, setCurrentBook] = useState(null)
  const [paramsId, setParamsId] = useState(null)
  
  const user = auth.currentUser

  const params = {}

useEffect(() => {
  params.id = window.location.search.split('=')[1]
  setParamsId(params.id)

  const getBookInfo = async () => {
    try {
      const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getBookInfo/${params.id}`);

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
  getBookInfo(params);

  const getUserInfo = async () => {
    try {
      const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getUserInfo/`);
      
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
      console.log(authorInfo)
      let filteredAuthor = authorInfo.filter((user) => user.books?.includes(params.id));
      setAuthor(filteredAuthor[0]);
      console.log(filteredAuthor[0])

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Usage
  getUserInfo();
  
  
  const getBookDetails = async () => {
    try {
      const response = await fetch(`https://us-central1-bookworm-site.cloudfunctions.net/getBookDetails/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Comments');
      }
  
      const data = await response.json();
      const commentsInfo = data.comments;
      let FilteredComments = commentsInfo.filter((comment) => { return comment.book === params.id })
  
      if (!FilteredComments) {
        setComments([])
      } else {
        setComments(FilteredComments);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Usage
  getBookDetails(params.id);
}, []);

  const handleSubmit = () => {
    setLoading(true)

    const currentBookRef = doc(db, 'BookCollection', `${paramsId}`)
    addDoc(collection(db, "BookComments"), {
      book: paramsId,
      title: title,
      rating: rating,
      description: description,
      displayName: user.displayName,
      photoURL: user.photoURL,
      identity: 'Reader',
    }
    ).then(() => {
        console.log(currentBook.data())
        updateDoc(currentBookRef, {
            'reviews.amount': currentBook.data().reviews.amount + 1,
            'reviews.total': currentBook.data().reviews.total + rating,
        }).then(() => {
            updateDoc(currentBookRef, {
              'reviews.average': currentBook.data().reviews.total / currentBook.data().reviews.amount
            })
          }) 
      setReview(0)
      setTitle('')
      setRating(0)
      setDescription('')
      setLoading(false)
    })
  }

  const handleCancel = (e) => {
    setTitle('')
    setRating(0)
    setDescription('')
    setReview(0)
    setLoading(false)
  }
  
    params && onSnapshot(doc(db, "BookCollection", `${paramsId}`), (currentBook) => {
    setCurrentBook(currentBook)
    })
  

  const handleLike = () => {
      if (currentBook.data().dislikes.includes(`${user?.uid}`)) {
        updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
          dislikes: arrayRemove(`${user?.uid}`),
          likes: arrayUnion(`${user?.uid}`)
          })  
      } else if (currentBook.data().likes.includes(`${user?.uid}`)) {
        updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
          likes: arrayRemove(`${user?.uid}`)
        })
      } else {
          updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
            likes: arrayUnion(`${user?.uid}`)
          })        
      };
  }

  const handleDislike = () => {
    if (currentBook.data().likes.includes(`${user?.uid}`)) {
      updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
        likes: arrayRemove(`${user?.uid}`),
        dislikes: arrayUnion(`${user?.uid}`)
        })  
    } else if (currentBook.data().dislikes.includes(`${user?.uid}`)) {
      updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
        dislikes: arrayRemove(`${user?.uid}`)
      })
    } else {
        updateDoc(doc(db, "BookCollection", `${currentBook.id}`), {
          dislikes: arrayUnion(`${user?.uid}`)
        })        
    };
  }
  
  if (book && author && comments) {
    return (
      <main>
        <Navbar />
        <div  className="hero">
          <div className='main-section'>
            <div className='book-reading'>
              {currentUser?.bookView === 'scroll' ? <iframe id='pdf-iframe' className="myPDF" src={book.pdfURL}/> :     
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
            <div className='author-info'>
              <div className='author-info-left-side'>
                <div className='author-info-left-side-top'>
                  <div className='author-info-left-side-top-profile-picture'>
                    <Image src={author.photoURL} alt='Authors-Profile-Picture' className="profile-picture-icon" width={80} height={80}/>
                  </div>
                  <div className='author-info-left-side-top-author-name'>
                    {author.displayName}
                  </div>
                </div>
                <div className='author-info-left-side-bottom'>
                  <div className='author-info-left-side-bottom-top'>
                    <div className='author-info-stat-top'>
                      <div className='author-info-stat-left'>
                        <div>
                          <IoPersonSharp className='author-info-icons'/> {book.views}
                        </div>
                      </div>
                      <div className='author-info-stat-right'>
                        <div>
                          {book.reviews.average} <FaStar className='author-info-icons'/>
                        </div> 
                      </div>
                    </div>
                    <div className='author-info-stat-bottom'>
                      <div className='author-info-stat-left'>
                        <div>
                          {book.likes ? book.likes.length : 0} <IoIosThumbsUp className='author-info-icons'/>
                        </div>
                      </div>
                      <div className='author-info-stat-right'>
                        <div>
                          {book.dislikes ? book.dislikes.length : 0} <IoIosThumbsDown className='author-info-icons'/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='divider'></div>
                  <div className='author-info-left-bottom-bio'>
                    <div className='middle-right'>
                      <div className='like-dislike'>
                        <div className={`like ${currentBook?.data()?.likes?.includes(`${user?.uid}`) ? 'like-active' : ''}`} onClick={handleLike}><IoIosThumbsUp className='author-info-icons'/></div>
                        <div className={`dislike ${currentBook?.data()?.dislikes?.includes(`${user?.uid}`) ? 'dislike-active' : ''}`} onClick={handleDislike}><IoIosThumbsDown className='author-info-icons'/></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='author-info-middle-side'>
                <p>{author.bio}</p>
              </div>
              <div className='author-info-right-side'>
                <div className='author-info-right-side-top-side'><h3>Blurb</h3></div>
                <div className='author-info-right-side-bottom-side'>
                  {book.blurb}
                </div>
              </div>
            </div>
            
            <div className='Divider'></div>

            <div className='comments-section'>
              <div className='comments-section-title'>
                <h3>Comments Section</h3>
                <h4>{comments.length} Comments</h4>
              </div>
              <div className='comments-section-main'>
                  <div className='comments-section-block'>
                    <div className='block-left'>
                      <div className='block-left-profile-picture'>
                        <Image alt='profile-picture' src={user?.photoURL} className="profile-picture-icon" width={80} height={80}/>
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
                {comments.map(comment => (
                  <div key={comment.id} className='comments-section-block'>
                    <div className='block-left'>
                      <div className='block-left-profile-picture'>
                        <Image alt='profile-picture' src={comment.photoURL} className="profile-picture-icon" width={80} height={80}/>
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
          </div>  
        </div>
      </main>
  );
  }
    
}

// import Navbar from '@/components/navbar';
// import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
// import { auth, db } from '@/firebase/config';
// import Image from 'next/image';
// import { IoPersonSharp } from "react-icons/io5"; 
// import { FaStar } from "react-icons/fa";
// import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";
// import BookView from '@/components/bookview';
// import BookAuthorInfo from '@/components/bookauthorinfo';
// import { ErrorBoundary } from 'next/dist/client/components/error-boundary';



// // Styles
// import './book.css'
// import BookComments from '@/components/bookcomments';

// export default function Book({ params }) {
  
//   const user = auth.currentUser
  
//     return (
//     <>
//       <main>
//         <Navbar />
//         <div  className="hero">
//           <div className='main-section'>
//             <BookView id={params.id}/>
//             <BookAuthorInfo id={params.id}/> 
            
//             <div className='Divider'></div>

//             <BookComments id={params.id}/>
           
//           </div>
//         </div>
//       </main>
//     </>
//   );
//   }   