import React from 'react'
import Image from 'next/image'
import styles from '@/styles/goBack.module.css'
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setView} from '@/redux/invoiceSlice';
import { setMod } from '@/redux/userSlice';
const goBack = () => {
    const dispatch = useDispatch();
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState) => state.user)
    
    const {isLight} = Mode
    const {mod} = UserData;

    return (
        <div className={styles.goBack} onClick={()=>{
                dispatch(setMod(!mod))
                dispatch(setView(true))
        }}>
            <Image src='/image/icon-arrow-left.svg' width='5' height='9' alt='arrow-left' />
            <p className={`${styles.goBackText} ${isLight?styles.light:styles.dark}`}>
                Go back
            </p>
        </div>
    )
}

export default goBack
