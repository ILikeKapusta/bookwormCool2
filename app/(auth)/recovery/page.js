"use client"

import { useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/hooks/useAuthContext'
import { FaEye, FaEyeSlash } from "react-icons/fa";




// styles
import './recovery.css'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/config'


const Recovery = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { user } = useAuthContext()

  const handleSubmitEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendPasswordResetEmail(auth, email)
        .then(() => setSuccess(true))
        .catch((error) => {
            setErrors(error)
        })
    } else {
      return
    }
  }

  const handleSubmitButton = (e) => {
    e.preventDefault()
    sendPasswordResetEmail(auth, email)
        .then(() => setSuccess(true))
        .catch((error) => {
            setErrors(error)
        })
  }

  
  return (
    <>
        <main>
            <div className="forgot-password-container">
                {!success && <div className="formbox">
                    <div>
                        <h1 id="title">Forgot Password</h1>
                    </div>
                    <form onKeyDown={handleSubmitEnter}>
                        <div className="input-group">
                            <div className="input-field">
                                <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                placeholder="Email" 
                                value={email}/>
                            </div>
                            <p>
                                <a href="/login">Back to Login</a>
                            </p>
                            {errors && <p className='error'>{errors}</p>}
                        </div>
                        <div className="btn-field">
                            <button type="button" onClick={handleSubmitButton}>Continue</button>
                            
                        </div>
                    </form>
                </div>}
                {success && <div className="formbox">
                    <div>
                        <h1 className='success' id="title">Success!</h1>
                    </div>
                    <div className='success-section'>
                        <p>Please check your emails for password reset link.</p>
                    </div>
                    <p className='return'>
                        <a href="/login">Return to Login</a>
                    </p>
                </div>}
            </div>
        </main>
    </>

  )
}

export default Recovery