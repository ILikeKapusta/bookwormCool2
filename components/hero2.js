import { BsFillCloudDownloadFill } from 'react-icons/bs'
import { FcRemoveImage } from 'react-icons/fc'
import { FaWorm } from 'react-icons/fa6'


import './hero2.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCheckoutUrl } from '@/stripe/stripePayments'
import { app, auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'
import { getPremiumStatus } from '@/stripe/getPremiumStatus'

const Hero2 = () => {
  const [show, setShow] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;
      setIsPremium(newPremiumStatus);
    };
    checkPremium();
  }, [app, auth.currentUser?.uid]);

  const router = useRouter()

  const handleCheckout = async () => {
    const priceId = "price_1OMewAGISLFSl1A9KKhBCcfY"
    const checkoutURL = await getCheckoutUrl(app, priceId)
    router.push(checkoutURL)
  } 

  return (
    <div className="hero2">
      {isPremium ? 
      <div className='hero-container2'>
      </div> : 
        <div className="hero-container2">
          <div className="top-side">
            <h2>Subscribe</h2>
            <p>Gain access to a bunch of great features to make your reading experience top notch!</p>
          </div>
          <div className="middle-side">
            <div className='content-box'>
              <div className='content-box-middle'><h3>Ad Free Reading</h3></div>
              <div className='content-box-left'>Remove all ads from books and around the website to gain a fluent and hassle free reading experience</div>
              <div className='content-box-right'><FcRemoveImage className='react-icons'/></div>
            </div>
            <div className='content-box'>
              <div className='content-box-middle'><h3>Offline Downloads</h3></div>
              <div className='content-box-left'>Download a collection of books for offline use for offline reading without internet such as on a plane, train or even in a forest!</div>
              <div className='content-box-right'><BsFillCloudDownloadFill className='react-icons'/></div>
            </div>
            <div className='content-box'>
              <div className='content-box-middle'><h3>Become a Bookworm Today</h3></div>
              <div className='content-box-left'>Support Bookworm and all the hardworking members behind your favorite online library</div>
              <div className='content-box-right'><FaWorm className='react-icons'/></div>
            </div>
          </div>
          <div className='bottom-side'>
            <button onClick={() => setShow(show ? false : true)}>Choose your Plan</button>
          </div>
          {show && <div className='bottom-bottom-side'>
            <div className='subscription-bottom-bottom-content-box'>
              <div className='content-box-middle'><h3>Classic Edition</h3></div>
              <div className='content-box-left'>The middle man for subscribing. Gain access to all the premium features of subscribing in a cost effective package.</div>
              <div className='bottom-bottom-content-box-right'>
                <p className='price-per-month'>$6 / month</p>
              </div>
              <div className='bottom-bottom-side-button-link'>
                <button className='bottom-bottom-side-button' onClick={handleCheckout}>Select</button>
              </div>
            </div>
          </div>}
        </div>}
    </div>
  )
}

export default Hero2