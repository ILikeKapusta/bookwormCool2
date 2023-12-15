"use client"

// components
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Hero1 from "../components/hero1";
import Hero2 from "../components/hero2";
import BookDisplay from "../components/bookdisplay";
import Script from "next/script";


export default function Home() {


  if (typeof window !== 'undefined') {
    return (
      <>
          <head>
            <Script
              type="text/javascript"
              src="https://app.termly.io/embed.min.js"
              data-auto-block="on"
              data-website-uuid="c3b2522b-69f1-4e14-99dd-fb29dd3c1634"
            ></Script>
          </head>
          <Navbar />
          <Hero1 />
          <div id="ezoic-pub-ad-placeholder-103"> </div>
          <div className="featured-books-main">
            <BookDisplay bookreview={false} filtertoggle={false} viewalltoggle={true} title={'Most Popular'} amount_visable={window?.innerWidth <= 425 && 6 || window?.innerWidth <= 768 && 2 || window?.innerWidth <= 1024 && 3 || window?.innerWidth <= 1440 && 5 || window?.innerWidth > 1440 && 6}/>
            <BookDisplay bookreview={false} filtertoggle={false} viewalltoggle={true} title={'This Weeks Best'} amount_visable={window?.innerWidth <= 425 && 6 || window?.innerWidth <= 768 && 2 || window?.innerWidth <= 1024 && 3 || window?.innerWidth <= 1440 && 5 || window?.innerWidth > 1440 && 6}/>
          </div>
          <Hero2 />
          <Footer /> 
      </>
    );  
  }}
  

