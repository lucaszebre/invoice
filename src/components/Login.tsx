import React, { useContext } from 'react';
import { auth, provider, db } from  '@/config/firebase'
import { signInWithPopup } from 'firebase/auth';
import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setMod } from '@/redux/userSlice';
interface User {
    uid: string;
    displayName: string | null;
}

const Login = () => {
    const dispatch = useDispatch();
    const UserData = useSelector((state:RootState) => state.user)
    const {mod} = UserData;

    const router = useRouter();


    const signInWithPopupGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem("IsAuth", JSON.stringify(true));
                router.push('/');
                dispatch(setMod(!mod))
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