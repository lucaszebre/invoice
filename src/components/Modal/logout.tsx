import React from 'react';
import styles from '@/styles/logout.module.css';
import { useInvoice } from '@/context/InvoiceContext'; // import the useInvoice hook
import ProfileImageUpload from '../ProfileImageUpload';
import { handleSignOut } from '@/utils/signout';
const Logout = () => {

    const {isLight} = useInvoice();  // use the hook

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
