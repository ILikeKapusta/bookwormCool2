import { useState } from 'react'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()


  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
      // login
      const user = await signInWithEmailAndPassword(auth, email, password)

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: user })

      setIsPending(false)
    }

  return { login, isPending, error }
}