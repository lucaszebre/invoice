import React from 'react'
import styles from '@/styles/barEditMobile.module.css'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { useUserData } from '@/context/UserDataContext.tsx'
import { changeInvoiceStatus } from '@/utils/updateStatus';
import { getStatusColors } from '@/utils/getStatusColor';
const barEditMobile = () => {

    const {setEdit,setIsDelete,isLight,setInvoice,invoice} = useInvoice();  // use the hook
    const {invoiceId,setMod,mod} = useUserData();
    const { color, colorStatus } = getStatusColors('paid');

    return (
        <div className={`${styles.BarEditMobile} ${isLight?styles.light:styles.dark}`}>
            <div className={styles.BarEditBlock2}>
                <div className={styles.Edit}
                onClick={()=>{
                    setEdit(true)
                }}
                >
                    Edit
                </div>
                <div className={styles.Delete} 
                onClick={()=>{
                    setIsDelete(true)
                }}
                >
                    Delete
                </div>
                <div className={styles.Paid}
                onClick={()=>{
                    changeInvoiceStatus(invoiceId,'paid')
                    setInvoice(
                        {...invoice,
                            status:'paid',
                            color:color,
                            colorStatus: colorStatus,
                        }
                    )
                    setMod(!mod)
                }}
                >
                    Mark as Paid 
                </div>
            </div>
        </div>
    )
}

export default barEditMobile
