import React from 'react'
import styles from '@/styles/filter.module.css'
import { useDispatch,useSelector } from 'react-redux';
import { setFilter } from '@/redux/invoiceSlice';
import { RootState } from '@/redux/store';
const Menufilter = () => {

    const dispatch = useDispatch();

    const invoiceState = useSelector((state:RootState) => state.invoice)
    const Mode = useSelector((state:RootState) => state.mode)
    const {filter} = invoiceState
    return (
        <div className={`${styles.Menufilter} ${Mode.isLight?styles.light:styles.dark}`}>
            <div className={styles.FilterRow}>
                <input type="checkbox"  className={styles.Checkbox}
                onChange={
                    (e)=>{
                        if(e.target.checked){
                            dispatch(
                                setFilter({
                                    ...filter,
                                    draft:true
                                })
                            )
                            
                        }else{
                            dispatch(
                                setFilter({
                                    ...filter,
                                    draft:false
                                })
                            )
                            
                        }
                    }
                }   
                />
                <p className={styles.FilterText}>
                    Draft
                </p>
            </div>
            <div className={styles.FilterRow}>
                <input type="checkbox" 
                    onChange={
                    (e)=>{
                        if(e.target.checked){
                            dispatch(
                                setFilter({
                                    ...filter,
                                    pending:true
                                })
                            )
                            
                        }else{
                            dispatch(
                                setFilter({
                                    ...filter,
                                    pending:false
                                })
                            )
                            
                        }
                    }
                }
                />
                <p className={styles.FilterText}>
                    Pending
                </p>
            </div>
            <div className={styles.FilterRow} >
                <input type="checkbox"  
                onChange={
                    (e)=>{
                        if(e.target.checked){
                            dispatch(
                                setFilter({
                                    ...filter,
                                    paid:true
                                })
                            )
                        }else{
                            dispatch(
                                setFilter({
                                    ...filter,
                                    paid:false
                                })
                            )
                        }
                    }
                }
                />
                <p className={styles.FilterText}>
                    Paid
                </p>
            </div>
        </div>
    )
}

export default Menufilter
