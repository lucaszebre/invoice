import React, { useEffect, useState } from 'react';
import Bar from './bar';
import styles from '@/styles/Allbar.module.css'
import Header from './header';
import Empty from './empty';
import AllView from './Allview';
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { useUserData } from '@/context/UserDataContext.tsx'
import { Invoice } from '@/types/InvoiceType';
import { getStatusColors } from '@/utils/getStatusColor';

    
const Allbar = () => {
    const {userData,invoices,setInvoiceId} = useUserData();
    
    const {view,setView,setInvoice,filter} = useInvoice();  // use the hook



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
                                                    setInvoice({
                                                        ...invoicd,
                                                        work: invoicd.description,
                                                        SenderStreet: invoicd.senderAddress.street,
                                                        SenderCity: invoicd.senderAddress.city,
                                                        SenderPostCode: invoicd.senderAddress.postCode,
                                                        SenderCountry: invoicd.senderAddress.country,
                                                        DateInvoice: invoicd.createdAt,
                                                        PaymentDue: invoicd.paymentDue,
                                                        PaymentDate: invoicd.paymentTerms.toString(),
                                                        ClientStreet: invoicd.clientAddress.street,
                                                        ClientCity: invoicd.clientAddress.city,
                                                        ClientPostCode: invoicd.clientAddress.postCode,
                                                        ClientCountry: invoicd.clientAddress.country,
                                                        clientEmail: invoicd.clientEmail,
                                                        price: invoicd.total.toString(),
                                                        color: color,
                                                        colorStatus: colorStatus,
                                                        PaymentTerm:invoicd.paymentTerms.toString()
                                                    });
                                                    setInvoiceId(invoicd.id)
                                                    setView(true);
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