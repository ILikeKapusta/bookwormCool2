"use client"

import { useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/hooks/useAuthContext'
import { FaEye, FaEyeSlash } from "react-icons/fa";




// styles
import './login.css'


const Login = () => {
  const { login, isPending, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { user } = useAuthContext()

  const handleSubmitEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      login(email, password)
    } else {
      return
    }
  }

  const handleSubmitButton = (e) => {
      e.preventDefault()
      login(email, password)    
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
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bookworm Login</title>
  <link rel="stylesheet" href="styles/login.css" />
  <main>
    <div className="login-container">
      <div className="formbox">
        <div>
          <h1 id="title">Login</h1>
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
              <div className="input-field">
                <input
                  id='password-input' 
                  onChange={(e) => setPassword(e.target.value)} 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={password}/>
                <div className='password-toggle-visable'>
                  {!showPassword && <FaEye onClick={handlePasswordVisable} className='react-icon-login'/>}
                  {showPassword && <FaEyeSlash onClick={handlePasswordVisable} className='react-icon-login'/>}
                </div>
              </div>
              
            <p>
              Dont have an account yet? <a href="/register">Register here</a>
            </p>

            <p>
              <a href="/recovery">Forgot Password?</a>
            </p>
          </div>
          <div className="btn-field">
            {!isPending && <button type="button" onClick={handleSubmitButton}>Login</button>}
            {isPending && <button type="button" disabled>Loading...</button>}
            {error && <p>{error.message}</p>}
          </div>
        </form>
      </div>
    </div>
  </main>
</>

  )
}

export default Login