import React from 'react'
import styles from '@/styles/delete.module.css' 
import { deleteInvoiceForCurrentUser } from '@/utils/deleteInvoice';
import { useDispatch,useSelector } from 'react-redux';
import { setIsDelete,setView } from '@/redux/invoiceSlice';
import { setMod } from '@/redux/userSlice';
import { RootState,AppDispatch } from '@/redux/store';
    
const Delete = () => {
        const dispatch = useDispatch<AppDispatch>();
        const invoiceState = useSelector((state:RootState) => state.invoice)
        const UserData = useSelector((state:RootState) => state.user)
        const {invoiceId,mod} = UserData;
        const Mode = useSelector((state:RootState) => state.mode)


        return (
        <div className={styles.DeleteDiv}
        style={{
            display: invoiceState.isDelete ? 'flex' : 'none'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if(e.target === e.currentTarget) {
                // perform an action if the event target is the current target
                dispatch(setIsDelete(false))
            }
        }}
        >
            <div className={`${styles.DeleteWrapper} ${Mode.isLight?styles.light:styles.dark}`} 
            style={{
                display: invoiceState.isDelete ? 'flex' : 'none'
            }} 
            >
                <div className={styles.DeleteText}>
                    <h1 className={styles.DeleteH1}>
                    Confirm Deletion
                    </h1>
                    <p className={styles.DeleteP}>
                    Are you sure you want to delete invoice #XM9141? This action cannot be undone.
                    </p>
                </div>
                <div className={styles.DeleteBlock}>
                    <button className={styles.Cancel}
                    onClick={()=>{
                        dispatch(setIsDelete(false))
                    }}
                    >
                        Cancel
                    </button>
                    <button className={styles.Delete} onClick={()=>{
                        if(invoiceId){
                            deleteInvoiceForCurrentUser(invoiceId)
                            dispatch(setMod(!mod))
                            dispatch(setView(true))
                            dispatch(setIsDelete(false))
                        }
                    }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
        )
    }
    
    export default Delete
    