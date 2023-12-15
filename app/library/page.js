"use client"

import Navbar from '@/components/navbar'
import LibraryBooks from '@/components/librarybooks'

// styles
import './library.css'


export default function Library() {

  if (typeof window !== 'undefined') {
    return (
        <>
          <Navbar/>
          <div className="featured-books-library">
            <div className="top-books-library">
              <div className="title-top-section-library">
                <h3>My Library</h3>
              </div>
              <div className="books-bottom-section-library">
                <LibraryBooks/>
              </div>
            </div>
          </div>
        </>
      )
  }
  
}
