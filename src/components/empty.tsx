import React from 'react'
import Image from 'next/dist/client/image'
import styles from '@/styles/empty.module.css'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook

const Empty = () => {

    const {isLight } = useInvoice();  // use the hook

    return (
        <div className={styles.Empty}>
            <div className={styles.EmptyImage}>
                <Image src='/image/illustration-empty.svg' alt='illustration-empty' fill />
            </div>
            <h1 className={`${styles.EmptyTitle} ${isLight?styles.light:styles.dark}`}>
                There is nothing here
            </h1>
            <p className={`${styles.EmptyDescription} ${isLight?styles.light:styles.dark}`}>
            Create an invoice by clicking the 
            New button and get started
            </p>
        </div>
    )
}

export default Empty
