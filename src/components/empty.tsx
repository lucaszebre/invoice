import React from 'react'
import Image from 'next/dist/client/image'
import styles from '@/styles/empty.module.css'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Empty = () => {
    const Mode = useSelector((state:RootState) => state.mode)
    
    const {isLight} = Mode

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
