'use client'

// Style
import './support.css'

import Navbar from '@/components/navbar'
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { BsTwitter, BsYoutube, BsTiktok } from 'react-icons/bs'
import { AiFillInstagram } from 'react-icons/ai'
import Link from 'next/link'

const colRefSup = collection(db, "support-tickets");

export default function Support() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
        addDoc(colRefSup, {
            Name: name,
            Email: email,
            Subject: subject,
            Body: body,
        }).then(() => {
          setName('')
          setEmail('')
          setSubject('')
          setBody('')
        })
  }

  if (typeof window !== 'undefined') {
    return (
      <>
          <Navbar/>
          <div className='body'>
            <div className='information-about-form'>
                <h3>Experiencing a Problem?</h3>
                <p>If you are experiencing any sort of bug, issue or problem, make sure to let us know by emailing us, calling us or letting us know on any of our socials below!</p>
            </div>
              <div className='forms-support-left-side'>
                <h2>Email Us</h2>
                <form className='support-form' onSubmit={handleSubmit}>
                  <div className="input-group">
                    <div className="input-field">
                      <label className='form-label' for='name'>Name</label>
                      <input
                        id='name' 
                        onChange={(e) => setName(e.target.value)} 
                        type="text"  
                        value={name}/>
                    </div>
                    <div className="input-field">
                      <label className='form-label' for='email'>Email</label>
                      <input 
                        id='email' 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="text" 
                        value={email}/>
                    </div>
                    <div className="input-field">
                      <label className='form-label' for='subject'>Subject</label>
                      <input 
                        id='subject' 
                        onChange={(e) => setSubject(e.target.value)} 
                        type="text" 
                        value={subject}/>
                    </div>
                    <div className="input-field">
                      <label className='form-label' for='body'>Information</label>
                      <textarea 
                        rows={5}
                        onChange={(e) => setBody(e.target.value)}
                        value={body}  
                        ></textarea>
                    </div>
                  </div>
                  <button>Submit</button>
                </form>
              </div> 
              <div className='forms-support-right-side'>
                <h2>Contact Us</h2>
                <div className='number-email'>
                  <p>mprbookworm@gmail.com<br></br> <br></br>0434 763 620</p>
                </div>
                
                <div className='media-icons'>
                    <Link className='social-media-icon' href={'https://twitter.com/MRBookworming'}>
                      <BsTwitter/>
                    </Link>
                    <Link className='social-media-icon' href={'https://www.youtube.com/channel/UC1PSLbrvBW0RbvJTvErzaQg'}>
                      <BsYoutube/>
                    </Link>
                    <Link className='social-media-icon' href={'https://www.instagram.com/theonlybookworm/'}>
                      <AiFillInstagram/>
                    </Link>
                    <Link className='social-media-icon' href={'https://www.tiktok.com/@theonlybookworm'}>
                      <BsTiktok/>
                    </Link>
                </div>
              </div> 
          </div> 
      </>
  )
  }
  
}
