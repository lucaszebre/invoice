import React from 'react'
import styles from '@/styles/view.module.css'
import { formatDate } from '@/utils/formatDate';
import { InvoiceItem } from '@/types/InvoiceType';
import {useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getStatusColors } from '@/utils/getStatusColor';
const view = (props:{
    id?:string,
    work?:string,
    SenderStreet?:string,
    SenderCity?:string,
    SenderPostCode?:string,
    SenderCountry?:string,
    DateInvoice?:string,
    PaymentDue?:string,
    PaymentDate?:string,
    clientName?:string,
    ClientStreet?:string,
    ClientCity?:string,
    ClientPostCode?:string,
    ClientCountry?:string,
    clientEmail?:string,
    price?:string
    items:InvoiceItem[]
}) => {
    const Mode = useSelector((state:RootState) => state.mode)
    
    const {isLight} = Mode

    const InvoiceId = useSelector((state:RootState) => state.user.invoiceId)

    const Invoices = useSelector((state:RootState) => state.user.invoices)
    const invoice = Invoices.find((item) => item.id == InvoiceId);
    const {color,colorStatus} = getStatusColors(invoice?.status)

    return (
        <div className={`${styles.view} ${isLight?styles.light:styles.dark}`}>
            <div className={styles.viewTop}>
                <div className={styles.viewTop1}>
                    <div className={styles.BarHashtag}>
                        <span className={styles.BarSpan}>#</span>
                        <p className={styles.BarCode}>
                            {props.id}
                        </p>
                    </div>
                    <p className={styles.viewWork}>
                        {props.work}
                    </p>
                </div>
                <div className={styles.viewTop2}>
                    <p className={styles.AdresseG}>
                        {props.SenderStreet}
                    </p> 
                    <p className={styles.AdresseG}>
                        {props.SenderCountry}
                    </p>
                    <p className={styles.AdresseG}>
                        {props.SenderPostCode}
                    </p>
                    <p className={styles.AdresseG}>
                        {props.SenderCity}
                    </p>

                </div>
            </div>
            <div className={styles.viewCenter}>
                <div className={styles.viewCenterBlock1}>
                    <div className={styles.InvoiceDate}>
                        <p className={styles.Date}>
                            Invoice Date
                        </p>
                        <p className={styles.Date2}>
                            {formatDate(props.DateInvoice||null)}
                        </p>
                    </div>

                    <div className={styles.InvoiceDate}>
                        <p className={styles.Date}>
                            Payment due
                        </p>
                        <p className={styles.Date2}>
                            {formatDate(props.PaymentDue||null)}

                        </p>
                    </div>
                </div>
                <div className={styles.viewCenterBlock2}>
                    <div className={styles.Block2Wrapper}>
                        <p className={styles.BlockTextG}>
                            Bill to
                        </p>
                        <p className={styles.BlockTextB}>
                            {
                            props.clientName
                            }
                        </p>
                    </div>
                    <p className={styles.Block2Text}>
                        {
                        props.ClientCity
                        }
                    </p>
                    <p className={styles.Block2Text}>
                        {
                        props.ClientCountry
                        }
                    </p>
                    <p className={styles.Block2Text}>
                        {
                        props.ClientPostCode
                        }
                    </p>
                    <p className={styles.Block2Text}>
                        {
                        props.ClientStreet
                        }
                    </p>
                </div>
                <div className={styles.viewCenterBlock3}>
                    <div className={styles.InvoiceDate}>
                            <p className={styles.Date}>
                            Sent to
                            </p>
                        <p className={styles.Date2}>
                            {props.clientEmail}
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.viewBottom}>
                <div className={styles.BottomCenterPC}>
                        <div className={styles.ItemName}>
                            <p className={styles.ItemG}>
                                Item Name 
                            </p>
                            {invoice &&   invoice.items.map((item, index) => (
                                <p key={index} className={styles.ItemG1}>
                                    {item.name}
                                </p>
                            ))}
                        </div>
                        <div className={styles.QTY}>
                            <p className={styles.ItemG}>
                                QTY.
                            </p>
                            {invoice &&   invoice.items.map((item, index) => (
                                <p key={index} className={styles.ItemG2}>
                                    {item.qty}
                                </p>
                            ))}
                
                        </div>
                        <div className={styles.Price}>
                            <p className={styles.ItemG}>
                                price
                            </p>
                            {invoice && invoice.items.map((item, index) => (
                                <p key={index} className={styles.ItemG2}>
                                    {`${item.price} $` }
                                </p>
                            ))}
                        </div>
                        <div className={styles.Total}>
                            <p className={styles.ItemG}>
                                Total
                            </p>
                            {invoice && invoice.items.map((item, index) => (
                                <p key={index} className={styles.ItemG2}>
                                    {`${item.total} $` }
                                </p>
                            ))}
                        </div>
                </div>
                <div className={styles.BottomCenterMobile}>
                    {invoice &&  invoice.items.map((item, index) => (
                        <div className={styles.CenterRow} key={index}>
                            <div className={styles.Row1}>
                                <p className={styles.RowTitle}>
                                    {item.name}
                                </p>
                                <p className={styles.Quantity}>
                                    {`${item.qty} x ${item.price} `}
                                </p>
                            </div>
                            <div className={styles.Row2}>
                                {`$ ${item.total}`}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`${styles.BottomWrapper} ${isLight?styles.light:styles.dark}`}>
                    <p className={styles.Amount}>
                        Amount due
                    </p>
                    <span className={styles.AmountPrice}>
                        $ {invoice?.total}
                    </span>
                </div>

            </div>
        
        </div>
    )
}

export default view
