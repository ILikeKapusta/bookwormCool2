import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '@/firebase/config';
import { useAuthContext } from './useAuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';

export const useSignUp = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const [currentUser, setCurrentUser] = useState(null)


    const signUp = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)
        
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            updateProfile(user, {displayName: displayName, photoURL: 'https://firebasestorage.googleapis.com/v0/b/bookworm-site.appspot.com/o/users%2Fdefault%2Fdefault.jfif?alt=media&token=e7568cf5-c8b1-41a6-acb9-5a67a6be135c' })
            setCurrentUser(user)
            setDoc(doc(db, 'users', `${user.uid}`), {
                displayName: displayName,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/bookworm-site.appspot.com/o/users%2Fdefault%2Fdefault.jfif?alt=media&token=e7568cf5-c8b1-41a6-acb9-5a67a6be135c',
                bio: 'empty',
                identity: 'Reader',
                bookView: 'flipbook'
            })
        })

        .catch((err) => {
            setError(err.message)
        })

        setIsPending(false)
    }

    useEffect(() => {
        // dispatch login action
        dispatch({ type: 'LOGIN', payload: currentUser })
    }, [currentUser])

    
    return { signUp, error, isPending }
} 