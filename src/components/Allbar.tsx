import React, { useEffect, useState } from 'react';
import Bar from './bar';
import styles from '@/styles/Allbar.module.css'
import Header from './header';
import Empty from './empty';
import AllView from './Allview';
import { Invoice } from '@/types/InvoiceType';
import { getStatusColors } from '@/utils/getStatusColor';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setView  } from '@/redux/invoiceSlice';
import { setInvoiceId } from '@/redux/userSlice';
import { fetchUserData } from '@/redux/userSlice';
import { AppDispatch } from '@/redux/store';  // replace with your store's actual path

const Allbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const invoiceState = useSelector((state:RootState) => state.invoice)
    const UserData = useSelector((state:RootState) => state.user)

    const {userData,invoices,mod} = UserData
    
    const {view,filter} = invoiceState;  // use the hook

    useEffect(() => {
        dispatch(fetchUserData());
    }, [,mod]);

    const noFilterSelected = !filter.draft && !filter.pending && !filter.paid;

    // This will filter the invoices based on the status that's been selected
    const filteredInvoices = noFilterSelected
        ? invoices
        : invoices.filter(invoice => 
            (filter.draft && invoice.status === 'draft') ||
            (filter.pending && invoice.status === 'pending') ||
            (filter.paid && invoice.status === 'paid')
        );



    return (
        <>
            {
                view ?
                    <div className={styles.Center}>
                        <div className={`${styles.CenterDiv} ${(userData?.invoices?.length ?? 0) > 0 && styles.notempty || styles.emptyCenter} `}  >
                            <Header />
                            {(filteredInvoices?.length ?? 0) > 0 ? (
                                <div className={styles.Allbar}>
                                    {filteredInvoices.map((invoicd: Invoice) => {
                                        const { color, colorStatus } = getStatusColors(invoicd.status);
                                        return (
                                            <Bar
                                                key={invoicd.id}
                                                id={invoicd.id}
                                                date={invoicd.createdAt}
                                                name={invoicd.clientName}
                                                price={invoicd.total.toString()}
                                                status={invoicd.status}
                                                color={color}
                                                colorStatus={colorStatus}
                                                onClick={() => {
                                                    dispatch(setInvoiceId(invoicd.id))
                                                    dispatch(setView(true))
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <Empty />
                            )}
                        </div>
                    </div> : <AllView />
            }
        </>
    );
};

export default Allbar;