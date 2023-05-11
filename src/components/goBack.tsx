import React from 'react'
import Image from 'next/image'
import styles from '@/styles/goBack.module.css'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { useUserData } from '@/context/UserDataContext.tsx'

const goBack = () => {

    const {view,setView,invoice,isLight } = useInvoice();  // use the hook
    const {setMod,mod} = useUserData();

    return (
        <div className={styles.goBack} onClick={()=>{
                setMod(!mod)
                setView(true)
        }}>
            <Image src='/image/icon-arrow-left.svg' width='5' height='9' alt='arrow-left' />
            <p className={`${styles.goBackText} ${isLight?styles.light:styles.dark}`}>
                Go back
            </p>
        </div>
    )
}

export default goBack
