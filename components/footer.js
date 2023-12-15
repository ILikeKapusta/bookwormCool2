import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube, FaInstagram } from "react-icons/fa";

import Link from 'next/link'

// Styles
import './footer.css'


const Footer = () => {
  return (
    <div className="footer">
    <div className="footer-col1">
      <h3>Useful Links</h3>
      <Link className="footer-col1-items" href="/support">Support</Link>
      <Link className="footer-col1-items" href="/library">My Library</Link>
      <Link className="footer-col1-items" href="/settings">Account Settings</Link>
      <Link className="footer-col1-items" href="/policy">Privacy Policy</Link>
      <Link className="footer-col1-items" href="/register">Register</Link>
      <Link className="footer-col1-items" href="/login ">Login</Link>
      <a href="#" onclick="window.displayPreferenceModal();return false;" id="termly-consent-preferences">Consent Preferences</a>
    </div>
    
    <div className="footer-col2"> 
      <h3>Social Media</h3>
      <div className="social-icons">
        <Link href={'https://twitter.com/MRBookworming'}>
          <FaXTwitter className="fa-brands fa-x-twitter" />
        </Link>
        
        <Link href={'/'}>
          <FaYoutube className="fa-brands fa-youtube" />
        </Link>
        
        <Link href={'https://www.instagram.com/theonlybookworm/'}>
          <FaInstagram className="fa-brands fa-instagram" />
        </Link>
      </div>

    </div>
    
    <div className="footer-col3">
      <h3>Contact</h3>
      <p>Phone Number: (61+)434 763 620</p>
      <br></br>
      <p>Email: mprbookworm@gmail.com</p>
    </div>
  </div>
  )
}

export default Footer