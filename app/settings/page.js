"use client"

import Navbar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { app, auth, db, storage } from '@/firebase/config'
import { onAuthStateChanged, updateEmail, updateProfile } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import flipbookgif from '../../public/flipbook.gif'
import scrollgif from '../../public/scroll.gif'
import Link from 'next/link'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'

// styles
import './settings.css'
import { getPortalUrl } from '@/stripe/stripePayments'
import { getPremiumStatus } from '@/stripe/getPremiumStatus'

export default function Settings() {
    const [setting, setSettings] = useState(0)
    const [edit, setEdit] = useState(0)
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [bsb, setBSB] = useState('')
    const [accNumber, setAccNum] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [profilePicError, setProfilePicError] = useState('')
    const [profileIdentity, setProfileIdentity] = useState('unknown')
    const [bookView, setBookView] = useState(null)
    const [savePending, setSavePending] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [ready, setReady] = useState(false)
    const [singleUser, setSingleUser] = useState(null)
    const [pageReady, setPageReady] = useState(false)
    
    const user = auth.currentUser;
    const router = useRouter()
  
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const UserRef = collection(db, "users");
                getDocs(UserRef)
                .then((snapshot) => {
                    let users = []
                    snapshot.docs.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id })
                    })
                    let filtered = users.filter(individualUser => individualUser.id === user.uid)
                    console.log(filtered[0])
                    setBio(filtered[0].bio); 
                    setBSB(filtered[0]?.BSB); 
                    setAccNum(filtered[0]?.AccNumber); 
                    setProfileIdentity(filtered[0].identity);
                    setBookView(filtered[0]?.bookView)
                    setPageReady(true)
                })
            } else if (!user) {
                router.push('/register')
            }
        })
        
    }, [])

    useEffect(() => {
        const checkPremium = async () => {
          const newPremiumStatus = auth.currentUser
            ? await getPremiumStatus(app)
            : false;
          setIsPremium(newPremiumStatus);
        };
        checkPremium();
      }, [app, auth.currentUser?.uid]);


    const handleName = (e) => {
        e.preventDefault()
        updateProfile(user, {displayName: `${displayName}`})
            .then(() => {
                setEdit(0)
                setDisplayName('')
            })
    }

    const handleEmail = (e) => {
        e.preventDefault()
        updateEmail(user, `${email}`)
            .then(() => {
                setEdit(0)
                setEmail('')
            })
    }

    const handleBio = (e) => {
        e.preventDefault()
        updateDoc(doc(db, "users", `${user.uid}`), {
            bio: `${bio}`
        })
            .then(() => {
                setEdit(0)
            })
    }

    const handleBSB = (e) => {
        e.preventDefault()
        updateDoc(doc(db, "users", `${user.uid}`), {
            BSB: `${bsb}`
        })
            .then(() => {
                setEdit(0)
            })
    }

    const handleAccNumber = (e) => {
        e.preventDefault()
        updateDoc(doc(db, "users", `${user.uid}`), {
            AccNumber: `${accNumber}`
        })
            .then(() => {
                setEdit(0)
            })
    }

    const handleProfilePic = (e) => {
        e.preventDefault()
        let selected = e.target.files[0]

        if (!selected) {
            setProfilePicError('Please select a file')
            return
        }
        if (!selected.type.includes('image')) {
            setProfilePicError('Selected file must be an img')
            return
        }
        if (selected.size > 5000000) {
            setProfilePicError('file must not be larger than 500kb')
            return
        }
        setProfilePicError('')
            let profilePicRef = ref(storage, `user/${user.uid}/profilePic.png`)
            uploadBytes(profilePicRef, selected)
                .then(() => {
                    getDownloadURL(profilePicRef)
                        .then((photoURL) => {
                            updateProfile(user, {photoURL: photoURL})
                        })
                })
    }

    const handleSave = (e) => {
        e.preventDefault()
        setSavePending(true)
        if (profileIdentity === 'Reader') {
            updateDoc(doc(db, "users", `${user.uid}`), {
            identity: `Reader`,
        })
            .then(() => {
                setProfileIdentity('Reader')
            })
        } else if (profileIdentity === 'Author') {
            updateDoc(doc(db, "users", `${user.uid}`), {
                identity: `Author`,
            })
                .then(() => {
                    setProfileIdentity('Author')
                })
        } else {
            setProfileIdentity('unknown')
        }
        setTimeout(() => setSavePending(false), 1000
        )
    }

    const handleFlipbook = () => {
        setBookView('flipbook')
        updateDoc(doc(db, "users", `${user.uid}`), {
            bookView: `flipbook`,
        })
    }

    const handleScroll = () => {
        setBookView('scroll')
        updateDoc(doc(db, "users", `${user.uid}`), {
            bookView: `scroll`,
        })
    }

    const manageSubscription = async () => {
        const portalURL = await getPortalUrl(app);
        router.push(portalURL);
        console.log('Manage Subscription')
    }


        

    if (pageReady) {
        
        return (
        <>
        <Navbar/>
        <div className="settings-exterior">
            <div className="settings-interior">
            <div className="settings-title">
                <h3>Settings</h3>
            </div>
            <div className="settings-content">
                <div className='settings-sidebar'>
                    <ul>
                        <li className={setting === 0 ? "active" : ""} onClick={() => setSettings(0)}>Personal Information</li>
                        <li className={setting === 1 ? "active" : ""} onClick={() => setSettings(1)}>Appearance</li>
                        <li className={setting === 4 ? "active" : ""} onClick={() => setSettings(4)}>Manage Subscription</li>
                        {profileIdentity === 'Author' && <li className={setting === 3 ? "active" : ""} onClick={() => setSettings(3)}>Author Settings</li>}
                    </ul>
                </div>
                <div className='settings-main'>
                    {setting === 0 && <div className='personal-information-content'>
                        <div className='personal-information-content-main'>
                            <div className='personal-information-content-left'>
                                <div className='bio-content-title'>
                                    <div className='personal-information-name'>Name</div>
                                </div>
                                <div className='bio-content'>
                                    {edit === 1 ? 
                                        <form onSubmit={handleName}>
                                            <div className='form-content'>
                                                <input 
                                                    type='text' 
                                                    required 
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    value={displayName} 
                                                />        
                                            </div>
                                        </form> : 
                                    <span className='personal-information-name'>{user.displayName}</span>}
                                    {edit === 0 && <div className='personal-information-edit' onClick={() => setEdit(1)}>Edit</div>}
                                </div>
                                <div className='bio-content-title'>
                                    <div className='personal-information-name'>Email</div>
                                </div>
                                <div className='bio-content'>
                                    {edit === 2 ? 
                                        <form onSubmit={handleEmail}>
                                            <div className='form-content'>
                                                <input 
                                                    type='text' 
                                                    required 
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    value={email} 
                                                />        
                                            </div>
                                        </form> : 
                                    <span className='personal-information-name'>{user.email}</span>}                                    
                                    {edit === 0 && <div className='personal-information-edit' onClick={() => setEdit(2)}>Edit</div>}
                                </div>
                                
                                <div className='bio-content-title'>
                                    <div className='personal-information-name'>Bio</div>
                                </div>
                                <div className='bio-content'>
                                    {edit === 3 ? 
                                        <form onSubmit={handleBio}>
                                            <div className='form-content'>
                                                <input 
                                                    type='text' 
                                                    required 
                                                    onChange={(e) => setBio(e.target.value)}
                                                    value={bio} 
                                                />        
                                            </div>
                                        </form> : 
                                    <span className='personal-information-name'>{bio}</span>}                                    
                                    {edit === 0 && <div className='personal-information-edit' onClick={() => setEdit(3)}>Edit</div>}                       
                                </div>
                                
                            </div>
                            
                            <div className='personal-information-content-right'>
                                <div className='profile-picture-section'>
                                    <Image src={user?.photoURL} className="profile-picture" width={300} height={300} alt='profile-picture'/>
                                    <label className='profile-picture-edit'>Change</label>
                                    <input type='file' id='profile-picture-input' onChange={handleProfilePic} hidden/>
                                    {profilePicError && <div className='error' onClick={() => setProfilePicError('')}>{profilePicError}</div>}
                                </div>

                                <div className='content-title'>
                                    <span className='Checker-title'>Are you a..</span>
                                    <span className={`Checker-option ${profileIdentity === 'Reader' ? 'Checker-option-active' : ""}`} onClick={() => setProfileIdentity('Reader')}>Reader</span>                                                        
                                    <span className={`Checker-option ${profileIdentity === 'Author' ? 'Checker-option-active' : ""}`} onClick={() => setProfileIdentity('Author')}>Author</span>                               
                                </div>
                                <div className='save-container'>
                                    <button className={`save-button ${savePending === true ? "save-button-success" : ""}`} onClick={handleSave}>{savePending === true ? 'Done!' : 'Save'}</button>
                                </div>

                            </div>
                        </div>
                    </div>}
                    
                    
                    
                    {setting === 1 && 
                    <div className='appearance-content'>
                        <div className='appearance-main'>
                            <div className='appearance-top'>
                                <Image className='appearance-top-gif' src={bookView === 'flipbook' ? flipbookgif : scrollgif}/>
                            </div>
                            <div className='appearance-bottom'>
                                <div className='appearance-toggle-section'>
                                    <span className={`appearance-option ${bookView === 'flipbook' ? 'appearance-option-active' : ""}`} onClick={handleFlipbook}>Flipbook</span>                                                        
                                    <span className={`appearance-option ${bookView === 'scroll' ? 'appearance-option-active' : ""}`} onClick={handleScroll}>Scroll</span>                               
                                </div>
                                
                            </div>
                        </div>
                    </div>}
                    
                    
                    
                    
                    {setting === 3 && 
                        <div className='author-payments-content'>
                                <div className='author-credentials'>
                                    <div className='author-cred-info'><p>If you're an author with books on Bookworm you can insert your bank account credentials to receive monthly payments from your books popularity</p></div>
                                        <div className='author-cred-top'>
                                            <div className='author-cred-left'>
                                                <span className='bsb-info-name'>Bsb Number: </span>
                                                <div className='bsb-info'>
                                                    <div className='bsb-content'>
                                                        {edit === 5 ? 
                                                            <form onSubmit={handleBSB}>
                                                                <div className='form-content'>
                                                                    <input 
                                                                        type='text' 
                                                                        required 
                                                                        onChange={(e) => setBSB(e.target.value)}
                                                                        value={bsb} 
                                                                    />        
                                                                </div>
                                                            </form> : 
                                                            <div className='bsb'>{bsb}</div>}                                    
                                                        {edit === 0 && <div className='bsb-edit' onClick={() => setEdit(5)}>Edit</div>}
                                                    </div>
                                                </div>
                                                
                                                <span className='acc-num-info-name'>Account Number: </span>
                                                <div className='acc-num-info'>
                                                    <div className='acc-num-content'>
                                                        {edit === 6 ? 
                                                            <form onSubmit={handleAccNumber}>
                                                                <div className='form-content'>
                                                                    <input 
                                                                        type='text' 
                                                                        required 
                                                                        onChange={(e) => setAccNum(e.target.value)}
                                                                        value={accNumber} 
                                                                    />        
                                                                </div>
                                                            </form> : 
                                                            <div className='acc-num'>{accNumber}</div>}                                    
                                                        {edit === 0 && <div className='acc-num-edit' onClick={() => setEdit(6)}>Edit</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='author-cred-right'>
                                                <div className='book-add-feature'>
                                                    <div className='book-add-title'>Add your Next Book Here!</div>
                                                    <Link className='book-add-button-link' href={`/add_book/?id=${user.uid}`}>
                                                        <div className='book-add-button'>+</div>
                                                    </Link>
                                                    
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    <div className='author-cred-bottom'>
                                        <h3 className='dashboard-title'>Dashboard</h3>
                                            <div className='author-dashboard'>
                                                <div className='dashboard-figures'>
                                                    <div className='dashboard-figures-title'>Total Books</div>
                                                    <div className='dashboard-figures-info'>3</div>
                                                </div>
                                                <div className='dashboard-figures'>
                                                    <div className='dashboard-figures-title'>This Months Revenue</div>
                                                    <div className='dashboard-figures-info'>$10.45</div>
                                                </div>
                                                <div className='dashboard-figures'>
                                                    <div className='dashboard-figures-title'>Total Revenue</div>
                                                    <div className='dashboard-figures-info'>$55.24</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                        </div>}

                        {setting === 4 && 
                            <div className='appearance-content'>
                                <div className='appearance-main'>
                                    {isPremium ? <div className='subscription-manage-top '>
                                        <div className='bottom-bottom-content-box subscribed'>
                                            <div className='content-box-middle'><h3>Classic Subscribed Edition</h3></div>
                                            <div className='content-box-left'>The middle man for subscribing. Gain access to all the premium features of subscribing in a cost effective package.</div>
                                            <div className='content-box-left'>
                                                <h5>Features Include:</h5>
                                                <ul>
                                                    <li>Ad Free Content</li>
                                                    <li>Supporting the Bookworm team</li>
                                                </ul>
                                            </div>
                                            <div className='bottom-bottom-content-box-right'>
                                                <h4>Current Plan</h4>
                                            </div>
                                            <div className='bottom-bottom-side-button-link'>
                                            </div>
                                        </div>
                                    </div> : 
                                    <div className='subscription-manage-top '>
                                        <div className='bottom-bottom-content-box not-subscribed'>
                                            <div className='content-box-middle'><h3>Classic Not Subscribed Edition</h3></div>
                                            <div className='content-box-left'>The regular experience of Bookworm without the benefits of the premium version. This version includes ads and is limited in features.</div>
                                            
                                            <div className='bottom-bottom-content-box-right'>
                                                <h4>Current Plan</h4>
                                            </div>
                                            <div className='bottom-bottom-side-button-link'>
                                            </div>
                                        </div>
                                    </div>}

                                    
                                    <div className='subscription-manage-bottom'>
                                        <div className='subscription-title-section'>
                                            <span className='subscription-title' onClick={manageSubscription}>Manage</span>                         
                                        </div>
                                    </div>
                                </div>
                            </div>}
                </div>
            </div>
            </div>
        </div>
        </>
  )
}}
