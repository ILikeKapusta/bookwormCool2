"use client"

import { collection, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import BookList from './renderbooks';
import Link from 'next/link';

// styles 
import './bookDisplay.css'
import ReviewBookList from './renderreviewbooks';

const BookReviewDisplay = ({ title, amount_visable, viewalltoggle, filtertoggle }) => {

  const colRef = collection(db, "BookCollection");
  const reviewRef = collection(db, "BookReviewsCollection");
  const [visable, setVisable] = useState(amount_visable)
  const [viewAllToggle, setViewAllToggle] = useState(viewalltoggle)
  const [filterToggle, setFilterToggle] = useState(filtertoggle)
  const [toggleGenres, setToggleGenres] = useState(false)
  const [toggleSort, setToggleSort] = useState(false)
  const [genres, setGenres] = useState('')
  const [sortBy, setSortBy] = useState('Views (Desc)')

  const bookReview = query(reviewRef, orderBy('views', 'desc'), limit(visable))

  let bookSectionHeight = {
    height: visable * 100 - (visable * 1/6 * 100)
  }

  const handleVisable = () => {
    setVisable(prev => prev + 24)
  }

  return (
    <div style={bookSectionHeight} className="top-books-main">
      <div className="title-top-section-main">
        <div></div>
        <p>{title}</p>
        {viewAllToggle && <Link className="View-all-main" href={'/search'}>View All</Link>}
        {filterToggle && <div className='filter-section'>
          <div className='left-filter'>
            <div className='left-filter-container'>
              <h3 onClick={() => setToggleGenres(toggleGenres ? false : true)}>Genres: {genres === '' ? 'All' : genres}</h3>
              {toggleGenres && <div className='list-of-genres-container'>
                <div className={`genre-option-filter ${genres === 'music' ? 'active' : ''}`} onClick={() => {setGenres('music'); setToggleGenres(false)}}>music</div>
                <div className={`genre-option-filter ${genres === 'autobiographical' ? 'active' : ''}`} onClick={() => {setGenres('autobiographical'); setToggleGenres(false)}}>autobiographical</div>
                <div className={`genre-option-filter ${genres === 'poetry' ? 'active' : ''}`} onClick={() => {setGenres('poetry'); setToggleGenres(false)}}>poetry</div>
                <div className={`genre-option-filter ${genres === 'philosophy' ? 'active' : ''}`} onClick={() => {setGenres('philosophy'); setToggleGenres(false)}}>philosophy</div>
                <div className={`genre-option-filter ${genres === 'sci-fi' ? 'active' : ''}`} onClick={() => {setGenres('sci-fi'); setToggleGenres(false)}}>sci-fi</div>
                <div className={`genre-option-filter ${genres === 'art' ? 'active' : ''}`} onClick={() => {setGenres('art'); setToggleGenres(false)}}>art</div>
                <div className={`genre-option-filter ${genres === 'historical' ? 'active' : ''}`} onClick={() => {setGenres('historical'); setToggleGenres(false)}}>historical</div>
                <div className={`genre-option-filter ${genres === 'japanese' ? 'active' : ''}`} onClick={() => {setGenres('japanese'); setToggleGenres(false)}}>japanese</div>
                <div className={`genre-option-filter ${genres === 'language' ? 'active' : ''}`} onClick={() => {setGenres('language'); setToggleGenres(false)}}>language</div>
                <div className={`genre-option-filter ${genres === 'business' ? 'active' : ''}`} onClick={() => {setGenres('business'); setToggleGenres(false)}}>business</div>
                <div></div>
                <div className={'genre-option-filter-confirm'} onClick={() => {setGenres(''); setToggleGenres(false)}}>Clear</div>

              </div>}
            </div>
          </div>
          <div className='right-filter'>
            <div className='right-filter-container'>
              <h3 className={`${toggleSort ? 'title-active' : ''}`} onClick={() => setToggleSort(toggleSort ? false : true)}>Sort By: {sortBy}</h3>
              {toggleSort && <div className='sort-by-list-container'>
                {sortBy !== 'Views (Asce)' && <div className='sort-by-option' onClick={() => {setSortBy('Views (Asce)'); setToggleSort(false)}}>Sort By: Views (Asce)</div>}
                {sortBy !== 'Views (Desc)' && <div className='sort-by-option' onClick={() => {setSortBy('Views (Desc)'); setToggleSort(false)}}>Sort By: Views (Desc)</div>}
                <div className='sort-by-option' onClick={() => {setSortBy('Liked (Desc)'); setToggleSort(false)}}>Sort By: Most Liked</div>
                <div className='sort-by-option' onClick={() => {setSortBy('Rating (Desc)'); setToggleSort(false)}}>Sort By: Highest Rated</div>
              </div>}
            </div>
            
            
          </div>
        </div>}
      </div>
      <div className="books-bottom-section-main">
          <ReviewBookList query={bookReview} genreOptions={genres}/>
      </div>
      <div className='show-more-main-section'>
        <button onClick={() => handleVisable()} className="show-more-main">Show more</button>
      </div>
    </div>
  )
}

export default BookReviewDisplay
