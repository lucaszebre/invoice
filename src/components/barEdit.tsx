import React from 'react'
import styles from '@/styles/barEdit.module.css'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { useUserData } from '@/context/UserDataContext.tsx'
import { changeInvoiceStatus } from '@/utils/updateStatus';
import { getStatusColors } from '@/utils/getStatusColor';

const barEdit = (props:{
    colorStatus?:string,
    color?:string,
    status?:string,
}) => {

    const {setEdit,setIsDelete,isLight,setInvoice,invoice} = useInvoice();  // use the hook
    const {invoiceId,setMod,mod} = useUserData();

    const { color, colorStatus } = getStatusColors('paid');
    return (
        <div className={`${styles.BarEdit} ${isLight?styles.light:styles.dark}`}>
            <div className={styles.BarEditBlock1}>
                <p className={styles.BarStatus}>
                    Status
                </p>
                <div className={styles.StatusDiv}
                    style={{ background: props.colorStatus }}
                    >
                        <div className={styles.StatusRound} 
                        style={{ background: props.color }}
                        ></div>
                        <p className={styles.StatusText}>{props.status}</p>
                    </div>
            </div>
            <div className={styles.BarEditBlock2}>
                <div className={styles.Edit} onClick={()=>{
                    setMod(!mod)
                    setEdit(true)
                }}>
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
                onClick={()=>{changeInvoiceStatus(invoiceId,'paid')
                setInvoice(
                    {...invoice,
                        status:'paid',
                        color:color,
                        colorStatus: colorStatus,
                    }
                )
                            setMod(!mod)}}
                >
                    Mark as Paid 
                </div>
            </div>
        </div>
    )
}

export default barEdit
