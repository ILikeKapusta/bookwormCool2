"use client"

import Image from 'next/image'
import Link from 'next/link'
import BookWormLogo from '../public/BookWormLogo.png'
import { useLogout } from '@/hooks/useLogout'
import { useAuthContext } from '@/hooks/useAuthContext'
import { auth } from '@/firebase/config'
import { useState } from 'react'
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";



// styles
import './navbar.css'


const Navbar = () => {
  const [toggle, setToggle] = useState(true)
  const [mobileToggle, setMobileToggle] = useState(false)
  const [searchToggle, setSearchToggle] = useState(window.innerWidth > 425 ? true : false)
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const currentUser = auth.currentUser


  return (
    <nav className="navbar">
      <div className='navbarlogo-container'>
        <Link href="/">
          <Image src={BookWormLogo} alt="Bookworm" className="navbarlogo" width={210} height={100}/>
        </Link>
      </div>
      
      <div className="searchbar-container">
        {searchToggle && <form action='/search' className="search-bar">
          <input type="text" placeholder="Your favorite book is..." name="query"/>
        </form>}
      </div>

      <div className="navbarmenu">
        <div className="dropdown-menu">
          <Link href="/search" className="navbarlinks1">
            Books
          </Link>
        </div>

        <div className="dropdown-menu">
          <Link href="/support" className="navbarlinks1">
            Support
          </Link>
          <div className="dropdown-info" />
        </div>
        <div className="dropdown-menu">
          {!user && <a href="/login" className="navbarlinks2">Login</a>}
        </div>
        <div className="dropdown-menu">
        {!user && <a href="/register" className="navbarlinks3">Register</a>}
        
        {user && 
        <>
          <div className='profile-content'>
            <div className='welcome-text'>Welcome, {currentUser.displayName}!</div>
            <div className='profile-dropdown'>
              <Image src={currentUser?.photoURL} className="profile-icon" onClick={() => setToggle(prevCheck => !prevCheck)} width={50} height={50} alt='Bookworm-Logo'/>
              {!toggle && <div className='profile-dropdown-content'>
                <Link href='/library'>My Library</Link>
                <Link href='/settings'>Settings</Link>
                <a onClick={() => logout()}>Logout</a>
              </div>}
            </div>
          </div>
          </>}
        </div>
      </div>
      <div className='mobile-navbar-container'>
        {!searchToggle && <div onClick={() => setSearchToggle(prevCheck => !prevCheck)} className='mobile-navbar-button search-button'>
          <FaSearch/>
        </div>}
        <div onClick={() => setMobileToggle(prevCheck => !prevCheck)} className='mobile-navbar-button'>
          <IoReorderThreeOutline/>
        </div>
        {mobileToggle && 
            <div className='mobile-navbar-main-container'>
              <div className="dropdown-menu">
                <Link href="/search" className="navbarlinks1 mobile-options">
                  Books
                </Link>
              </div>

              <div className="dropdown-menu">
                <Link href="/support" className="navbarlinks1 mobile-options">
                  Support
                </Link>
                <div className="dropdown-info" />
              </div>
              <div className="dropdown-menu">
                {!user && <a href="/login" className="navbarlinks2 mobile-options">Login</a>}
              </div>
              <div className="dropdown-menu">
                {!user && <a href="/register" className="navbarlinks3 mobile-options">Register</a>}
              </div>
              {user &&
              <>
                <div className='dropdown-menu'>
                  <Link href='/library' className="navbarlinks1 mobile-options">
                    My Library
                  </Link>
                </div>
                <div className='dropdown-menu'>
                  <Link href='/settings' className="navbarlinks1 mobile-options">
                    Settings
                  </Link>
                </div>
                <div className='dropdown-menu'>
                  <a onClick={() => logout()} className='navbarlinks1 logout mobile-options'>Logout</a>
                </div>
              </>}
            </div>}
      </div>
    </nav>
  )
}

export default Navbar