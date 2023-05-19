import React from 'react'
import styles from '@/styles/barEditMobile.module.css'
import { changeInvoiceStatus } from '@/utils/updateStatus';
import { getStatusColors } from '@/utils/getStatusColor';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setEdit,setIsDelete,setInvoice } from '@/redux/invoiceSlice';
import { setMod } from '@/redux/userSlice';

const barEditMobile = () => {
    const dispatch = useDispatch();
    const invoiceState = useSelector((state:RootState) => state.invoice)
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState) => state.user)

    const {invoice } = invoiceState;
    const {isLight} = Mode
    const {invoiceId,mod} = UserData
    const { color, colorStatus } = getStatusColors('paid');

    return (
        <div className={`${styles.BarEditMobile} ${isLight?styles.light:styles.dark}`}>
            <div className={styles.BarEditBlock2}>
                <div className={styles.Edit}
                onClick={()=>{
                    dispatch(setEdit(true))
                }}
                >
                    Edit
                </div>
                <div className={styles.Delete} 
                onClick={()=>{
                    dispatch(setIsDelete(true))
                }}
                >
                    Delete
                </div>
                <div className={styles.Paid}
                onClick={()=>{
                    changeInvoiceStatus(invoiceId,'paid')
                    dispatch(
                    setInvoice(
                        {...invoice,
                            status:'paid',
                            color:color,
                            colorStatus: colorStatus,
                        }
                    ))
                    dispatch(setMod(!mod))
                }}
                >
                    Mark as Paid 
                </div>
            </div>
        </div>
    )
}

export default barEditMobile
