import React from 'react'
import styles from '@/styles/barEdit.module.css'
import { changeInvoiceStatus } from '@/utils/updateStatus';
import { getStatusColors } from '@/utils/getStatusColor';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setEdit,setIsDelete } from '@/redux/invoiceSlice';
import { setMod } from '@/redux/userSlice';

const barEdit = (props:{
    colorStatus?:string,
    color?:string,
    status?:string,
}) => {

    const dispatch = useDispatch();
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState) => state.user)

    const {isLight} = Mode

    const {invoiceId,mod} = UserData

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
                    dispatch(setMod(!mod))
                    dispatch(setEdit(true))
                }}>
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
                onClick={()=>{changeInvoiceStatus(invoiceId,'paid')
                
                dispatch(setMod(!mod))}}
                >
                    Mark as Paid 
                </div>
            </div>
        </div>
    )
}

export default barEdit
