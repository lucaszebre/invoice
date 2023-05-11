import React from 'react'
import GoBack from '@/components/goBack'
import BarEdit from '@/components/barEdit'
import BarEditMobile from '@/components/barEditMobile'
import Sidebar from '@/components/sidebar'
import View from '@/components/view'
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import styles from '@/styles/viewPage.module.css'
import EditInvoice from './editInvoice'
const AllView = () => {

    const {view,setView,setInvoice,invoice } = useInvoice();  // use the hook

    return (
        <>
        <EditInvoice  />
        <Sidebar />
        <div className={styles.ViewDiv}>
            <div className={styles.ViewCenter}>
                <GoBack />
                <BarEdit status={invoice?.status} color={invoice?.color} colorStatus={invoice?.colorStatus} />
                <BarEditMobile />
                <View  items={invoice.items} id={invoice?.id} work={invoice?.work} SenderCity={invoice?.SenderCity} SenderCountry={invoice?.SenderCountry} SenderPostCode={invoice?.SenderPostCode} SenderStreet={invoice?.SenderStreet} DateInvoice={invoice?.DateInvoice} PaymentDue={invoice?.PaymentDue} PaymentDate={invoice?.PaymentDate} clientName={invoice?.clientName} ClientStreet={invoice?.ClientStreet} ClientCity={invoice?.ClientCity} ClientPostCode={invoice?.ClientPostCode} ClientCountry={invoice?.ClientCountry} clientEmail={invoice?.clientEmail} price={invoice?.price} />

            </div>
        </div>
            
        </>
    )
}

export default AllView
