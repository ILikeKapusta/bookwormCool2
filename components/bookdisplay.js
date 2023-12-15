"use client"

import { collection, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useEffect, useState } from 'react';
import BookList from './renderbooks';
import Link from 'next/link';
import { FaChevronDown } from "react-icons/fa";


// styles 
import './bookDisplay.css'

const BookDisplay = ({ title, amount_visable, search, viewalltoggle, filtertoggle }) => {

  const colRef = collection(db, "BookCollection");
  const [visable, setVisable] = useState(amount_visable)
  const [viewAllToggle, setViewAllToggle] = useState(viewalltoggle)
  const [filterToggle, setFilterToggle] = useState(filtertoggle)
  const [toggleGenres, setToggleGenres] = useState(false)
  const [toggleSort, setToggleSort] = useState(false)
  const [genres, setGenres] = useState('')
  const [sortBy, setSortBy] = useState('Views (Desc)')

  const viewDescend = query(colRef, orderBy('views', 'desc'), limit(visable));
  const viewsAscend = query(colRef, orderBy('views'), limit(visable));
  const LikesDescend = query(colRef, orderBy('likes', 'desc'), limit(visable));
  const ratingDescend = query(colRef, orderBy('reviews.average', 'desc'), limit(visable));

  let bookSectionHeight = {
    height: window.innerWidth <= 425 && visable * 499 || window.innerWidth <= 768 && visable * 100 - (visable * 1/6 * 100) + 400 || window.innerWidth <= 1024 && visable * 100 - (visable * 1/6 * 100) + 250 || window.innerWidth <= 1440 && visable * 100 - (visable * 1/6 * 100) + 100
  }

  const handleVisable = () => {
    setVisable(prev => prev + 24)
  }

  const genreItems = ['Fiction', 'Non-fiction', 'Fantasy', 'Sci-fi', 'Dystopian', 'Action', 'Adventure', 'Mystery', 'Horror', 'Thriller', 'Historical', 'Romance', 'LGBTQ+', 'Literary', 'Young Adult', 'Short Story', 'Childrens', 'Biography', 'Memoir', 'Self-help', 'Travel', 'True Crime', 'Humor', 'How-to', 'Social Sciences', 'Parenting']


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
              {toggleGenres && 
              <div className='list-of-genres-container'>
                {genreItems.map((item) => 
                  <div className={`genre-option-filter ${genres === item ? 'active' : ''}`} onClick={() => {setGenres(item); setToggleGenres(false)}}>{item}</div>
                )}
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
          <BookList query={sortBy === 'Views (Desc)' && viewDescend || sortBy === 'Views (Asce)' && viewsAscend || sortBy === 'Liked (Desc)' && LikesDescend || sortBy === 'Rating (Desc)' && ratingDescend} search={search} genreOptions={genres}/>
      </div>
      <div className='show-more-main-section'>
        <button onClick={() => handleVisable()} className="show-more-main"><FaChevronDown/></button>
      </div>
    </div>
  )
}

export default BookDisplay
