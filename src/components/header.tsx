import React,{useState} from 'react'
import styles from '@/styles/header.module.css'
import Image from 'next/image'
import useWindowWidth from '../libs/useWindownWidth'
import Filter from './Modal/filter'
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIsNew} from '@/redux/invoiceSlice';
const Header = () => {
    const dispatch = useDispatch();
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState) => state.user)
    const {isLight} = Mode
    const {invoices} = UserData;

    function NumberInvoice(){
        var number = invoices.length
        if( number == undefined){
            number=0
        }
        if(windowWidth<=765){
            return `${number} invoices`
        }else{
            return `There are ${number} total invoices`
        }
    }
    const windowWidth = useWindowWidth();
    const [filter,setFilter]= useState(false)
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.HeaderBlock1}>
                    <h1 className={`${styles.HeaderTitle} ${isLight?styles.light:styles.dark}`}>
                        Invoices
                    </h1>
                    <p className={`${styles.HeaderDescription} ${isLight?styles.light:styles.dark}`}>
                    {NumberInvoice()}
                    
                    </p>
                </div>
                <div className={styles.HeaderBlock2}>
                    {filter && <Filter />}
                    <div className={styles.Status} onClick={()=>{setFilter(!filter);
                        
                    }}>
                        <span className={`${styles.StatusText} ${isLight?styles.light:styles.dark}`}>
                        {windowWidth <= 765 ?  '':'Filter by status' }
                        </span>
                        <Image src={'/image/icon-arrow-down.svg'} alt='icon-arrow-down' width={8} height={8}  />
                    </div>
                    <div className={styles.StatusWrapper} onClick={()=>{
                        dispatch(setIsNew(true))
                    }}>
                        <div className={styles.CroixBlock}>
                            <Image src={'/image/icon-plus.svg'} alt='icon-plus' width={10} height={10} />
                        </div>
                        <span className={styles.CroixText}>
                        {windowWidth <= 765 ?  '':'New Invoice' }
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header