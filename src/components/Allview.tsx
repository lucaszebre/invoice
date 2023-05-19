import React from 'react'
import GoBack from '@/components/goBack'
import BarEdit from '@/components/barEdit'
import BarEditMobile from '@/components/barEditMobile'
import Sidebar from '@/components/sidebar'
import View from '@/components/view'
import styles from '@/styles/viewPage.module.css'
import EditInvoice from './editInvoice'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getStatusColors } from '@/utils/getStatusColor'
const AllView = () => {
    const InvoiceId = useSelector((state:RootState) => state.user.invoiceId)

    const Invoices = useSelector((state:RootState) => state.user.invoices)
    const invoice = Invoices.find((item) => item.id == InvoiceId);
    const {color,colorStatus} = getStatusColors(invoice?.status)
    
    console.log(invoice)
    
    
    return (
        <>
        <EditInvoice  />
        <Sidebar alt={true} />
        <div className={styles.ViewDiv}>
            <div className={styles.ViewCenter}>
                <GoBack />
                <BarEdit status={invoice?.status} color={color} colorStatus={colorStatus} />
                <BarEditMobile />
                <View  items={invoice?.items ? invoice.items:[]} id={invoice?.id} work={invoice?.description} SenderCity={invoice?.senderAddress.city} SenderCountry={invoice?.senderAddress.country} SenderPostCode={invoice?.senderAddress.postCode} SenderStreet={invoice?.senderAddress.street} DateInvoice={invoice?.createdAt} PaymentDue={invoice?.paymentDue} PaymentDate={invoice?.paymentDue} clientName={invoice?.clientName} ClientStreet={invoice?.clientAddress.street} ClientCity={invoice?.clientAddress.city} ClientPostCode={invoice?.clientAddress.postCode} ClientCountry={invoice?.clientAddress.country} clientEmail={invoice?.clientEmail} price={invoice?.total} />

            </div>
        </div>
            
        </>
    )
}

export default AllView
