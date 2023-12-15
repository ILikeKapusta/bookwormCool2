"use client"

import { useRouter } from 'next/navigation'
import { auth } from '@/firebase/config'
import Navbar from '@/components/navbar'
import BookReviewDisplay from '@/components/bookreviewdisplay'
import { useEffect } from 'react'

// Styles
import './bookreview.css' 
import { onAuthStateChanged } from 'firebase/auth'

export default function bookReview() {
  
    const user = auth.currentUser
    const router = useRouter()

    onAuthStateChanged(auth, (user) => {
      if (user?.uid !== 'YKtzZ97DJuafT9CTsJ6Vwxqwxr92') {
      console.log('user is not admin')
      router.push('/')
      } else {
        console.log('user is admin')
      }
    })
    

    if (typeof window !== 'undefined') {
      return (
          <>
            <body>
            <Navbar/>
              <section>
                <div className="search-Main-Section">
                  <BookReviewDisplay filtertoggle={false} viewalltoggle={false}  title={"Book Reviews"} amount_visable={50}/>
                </div>
              </section>
            </body>
          </>
        )
    }

}
