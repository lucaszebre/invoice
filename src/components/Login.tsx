import React, { useContext } from 'react';
import { auth, provider, db } from  '@/config/firebase'
import { signInWithPopup } from 'firebase/auth';
import { collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";
import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUserData } from '@/context/UserDataContext.tsx'


interface User {
    uid: string;
    displayName: string | null;
}

const Login = () => {
    const {setMod,mod} = useUserData();

    const router = useRouter();


    const signInWithPopupGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result.user); // prints the user information
                localStorage.setItem("IsAuth", JSON.stringify(true));
                router.push('/');
                setMod(!mod)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className={styles.loginDiv}>
            <h1 className={styles.loginTitle}>Sign up with your Google account</h1>
            <button className={styles.loginWithGoogleBtn} 
                onClick={()=>signInWithPopupGoogle()}
            >
                <Image src='/icon-google.svg' alt="Google logo" width={48} height={48}  /> Sign in with Google
            </button>
        </div>
    );
};

export default Login;