import React from 'react'
import './hero1.css'

const Hero1 = () => {
  return (
    <div className="hero1">
    <div className="hero-container">
      <div className="left-side">
        <h1>Who are we?</h1>
        <p>
          We are your virtual library, providing hundreds of free books for you
          to enjoy. Below are a list of the most popular books for this week.
        </p>
      </div>
      <div className="right-side">
        <img src="index-library.jpg" alt="" />
      </div>
    </div>
  </div>
  )
}

export default Hero1