import React from 'react'
import styles from '@/styles/delete.module.css' 
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { deleteInvoiceForCurrentUser } from '@/utils/deleteInvoice';
import { useUserData } from '@/context/UserDataContext.tsx'
    const Delete = () => {
        
        const {invoiceId,setMod,mod} = useUserData();

        const {isdelete,setIsDelete,setView,isLight} = useInvoice();  // use the hook

        return (
        <div className={styles.DeleteDiv}
        style={{
            display: isdelete ? 'flex' : 'none'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if(e.target === e.currentTarget) {
                // perform an action if the event target is the current target
                setIsDelete(false)
            }
        }}
        >
            <div className={`${styles.DeleteWrapper} ${isLight?styles.light:styles.dark}`} 
            style={{
                display: isdelete ? 'flex' : 'none'
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
                        setIsDelete(false)
                    }}
                    >
                        Cancel
                    </button>
                    <button className={styles.Delete} onClick={()=>{
                        if(invoiceId){
                            deleteInvoiceForCurrentUser(invoiceId)
                            setMod(!mod)
                            setView(true)
                            setIsDelete(false)
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
    