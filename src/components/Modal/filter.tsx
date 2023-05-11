import React from 'react'
import styles from '@/styles/filter.module.css'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook

const Menufilter = () => {

    const {isLight,setFilter,filter } = useInvoice();  // use the hook

    return (
        <div className={`${styles.Menufilter} ${isLight?styles.light:styles.dark}`}>
            <div className={styles.FilterRow}>
                <input type="checkbox"  className={styles.Checkbox}
                onChange={
                    (e)=>{
                        if(e.target.checked){
                            setFilter({
                                ...filter,
                                draft:true
                            })
                        }else{
                            setFilter({
                                ...filter,
                                draft:false
                            })
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
                            setFilter({
                                ...filter,
                                pending:true
                            })
                        }else{
                            setFilter({
                                ...filter,
                                pending:false
                            })
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
                            setFilter({
                                ...filter,
                                paid:true
                            })
                        }else{
                            setFilter({
                                ...filter,
                                paid:false
                            })
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
