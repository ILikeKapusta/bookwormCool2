import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";


export default function Comments({ params }) {
    const [bookCol, setBookCol] = useState(null)
    const [CommentsCol, setCommentsCol] = useState(null)
    
    useEffect(() => {
      const colRef = collection(db, "BookCollection");
      getDocs(colRef)
        .then((snapshot) => {
          let books = []
          snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id })
          })
          setBookCol(books)
        })
      const ComRef = collection(db, "BookComments");
      getDocs(ComRef)
        .then((snapshot) => {
          let comments = []
          snapshot.docs.forEach((doc) => {
            comments.push({ ...doc.data(), id: doc.id })
          })
          setCommentsCol(comments)
        })
    }, [])   
    
  
    const Filtered = bookCol && bookCol.filter((book) => { 
      return book.id === params.id
    })
  
    return (
        specificComments && specificComments.map(comment => (
            <div className='comments-section'>
                <div className='comments-section-title'>
                  <h3>Comments Section</h3>
                </div>
                <div className='comments-section-main'>
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
                          Title
                        </h3>
                        <div>
                          Rating
                        </div>
                      </div>
                      <div className='block-right-bottom'>
                        <p>
                          description
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
            </div>
        ))
    )
}
