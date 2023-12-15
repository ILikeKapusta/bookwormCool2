"use client"

import { useSignUp } from '../../../hooks/useSignUp'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/hooks/useAuthContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

// styles
import './register.css'

const Register = () => {
  const { signUp, error, isPending } = useSignUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [checkValue, setCheckValue] = useState(false)
  const [displayError, setDisplayError] = useState(null)
  const router = useRouter()
  const { user } = useAuthContext()

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      if (checkValue === true) {
        e.preventDefault()
        signUp(email, password, displayName)
      } else {
        console.log('accept terms and conditions')
        setDisplayError('Please accept the terms and conditions')
      }
    } else {
      
      return
    }
  }

  const handleSubmitButton = (e) => {
    if (checkValue === true) {
      e.preventDefault()
      signUp(email, password, displayName)
    } else {
      console.log('accept terms and conditions')
      setDisplayError('Please accept the terms and conditions')
    }
}

const handlePasswordVisable = (e) => {
  if (showPassword) {
    setShowPassword(false)
  } else {
    setShowPassword(true)
  }
}

  if (user) {
    setTimeout(() => {
      router.push('/')
    }, 1500)
  }  
  
  return (
  <>
    <title>Bookworm Register</title>
    <div className="signup-container">
      <div className="formbox">
        <h1 id="title">Register</h1>
        <form onKeyDown={handleSubmit}>
          <div className="input-group">
            <div className="register-input-field">
              <input 
                onChange={(e) => setDisplayName(e.target.value)} 
                type="text" 
                placeholder="Username" 
                value={displayName}/>
            </div>
            <div className="register-input-field">
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="Email" 
                value={email}/>
            </div>
            <div className="register-input-field">
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                type={showPassword ? 'text' : 'password'}
                placeholder="Password" 
                value={password}
                />
              <div className='password-toggle-visable'>
                {!showPassword && <FaEye onClick={handlePasswordVisable} className='react-icon-login'/>}
                {showPassword && <FaEyeSlash onClick={handlePasswordVisable} className='react-icon-login'/>}
              </div>
            </div>
            <div className="register-input-field-checkbox">
              <input 
                type='checkbox'
                checked={checkValue}
                onChange={() => setCheckValue(prev => !prev)}
                />
                <p>
                  I understand and will adheare to the <a href="/terms&conditions">terms and conditions</a>
                </p>
            </div>
            
          </div>
          <div>
            {displayError && <p className='displayerror'>{displayError}</p>}
          </div>
          <div className="btn-field">
            {!isPending && <button type="button" onClick={handleSubmitButton}>Register</button>}
            {isPending && <button type="button" disabled>Loading...</button>}
          </div>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
          {error && <div>{error.message}</div>}
        </form>
      </div>
    </div>
  </>
  )
}

export default Register