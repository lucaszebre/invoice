import React from 'react';
import styles from '@/styles/logout.module.css';
import ProfileImageUpload from '../ProfileImageUpload';
import { auth } from '@/config/firebase'; // import auth from your firebase.ts file
import { useRouter } from 'next/dist/client/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Logout = () => {
    const Mode = useSelector((state:RootState) => state.mode)

    const router = useRouter();

    const {isLight} = Mode;  // use the hook

    const handleSignOut = async () => {
        try {
        await auth.signOut();
        router.push('/connexion')
        } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out');
        }
    };
    return (
        <>
        <div className={`${styles.Logout} ${isLight ? styles.light : styles.dark}`}>
        <p className={styles.LogoutText} onClick={handleSignOut}>Logout</p>
        <ProfileImageUpload />
        </div>
        </>
    );
};

export default Logout;
