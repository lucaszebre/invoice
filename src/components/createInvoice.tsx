import React , {useRef,useEffect,useState } from 'react'
import styles from '@/styles/CreateInvoice.module.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { z , ZodType} from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { addInvoiceForCurrentUser } from '@/utils/addInvoice';
import { Invoice } from '@/types/InvoiceType';
import { useUserData } from '@/context/UserDataContext.tsx'

const CreateInvoice = (props:{code:string}) => {
        const [status,setStatus] = useState('paid')

        const {isNew,setIsNew,isLight} = useInvoice();  // use the hook
        const {userData,setMod,mod} = useUserData();

        const editInvoiceRef = useRef<HTMLDivElement>(null);
        const bottomRef = useRef<HTMLDivElement>(null);
        const [isBottomFixed, setIsBottomFixed] = React.useState(false);

        const [items, setItems] = useState([{ name: "", qty: "", price: "" , total: ""}]);

        const Schema : ZodType = z.object({
            streetAdress:z.string().min(1,'must put a adress'),
            City:z.string().min(1,'must put a city').max(30,'the city is too long'),
            Postcode:z.string().min(1,'the postcode is too short').max(5,'the postcode is too long'),
            Country:z.string().min(1,'the country is too short').max(15,'the country is too long'),
            ClientName:z.string().min(1,'clientName is too shorts').max(30,'client Name is too long'),
            ClientEmail:z.string().email('your email is not well formated'),
            ClientStreetAdress:z.string().min(1,'must put the clien adress'),
            ClientCity:z.string().min(1,'must put the client city').max(30,'the client city is too long'),
            ClientPostCode:z.string().min(1, 'must put the client post code').max(5,' too long'),
            ClientCountry:z.string().min(1,'must put a client country').max(30,'the client country is too long'),
            InvoiceDate: z.string(),
            PaymentTerm:z.string().min(0,'must choose the paymentTerm').max(30,'your paymentTerm is too long'),
            ProjectDes:z.string().min(2,'must put your project description').max(30,'your description is too long'),
        })
        type SchemaType = z.infer<typeof Schema>;


        const {register,watch, handleSubmit,control,
        formState:{errors}} = useForm<SchemaType>({resolver:zodResolver(Schema)})

        function Paymentdue(date1:string,days:string){
            // Convert the date1 string into a Date object
            let dueDate = new Date(date1);
            // Add the number of days to the Date object
            dueDate.setDate(dueDate.getDate() + parseInt(days, 10));
            // Format the date into "YYYY-MM-DD" format
            let formattedDate = dueDate.toISOString().slice(0,10);
            return formattedDate;
        }

        function getTotalSum(items: { name: string, qty: string, price: string, total: string }[]) {
            let total = 0;
            items.forEach(item => {
                total += Number(item.price) * Number(item.qty);
            });
        
            // Return as string
            return total.toFixed(2); // It will round the number to 2 decimal places
        }

        const submitData = async ( data:SchemaType ) => {
            const watched = watch()
                        // Prepare the invoice data in the format expected by the function
            const invoiceData: Omit<Invoice, 'id'> = {
                // Fill in the fields with the data from the form
                createdAt: watched.InvoiceDate,
                clientName: data.ClientName,
                clientEmail: data.ClientEmail,
                clientAddress: {
                    street: data.ClientStreetAdress,
                    city: data.ClientCity,
                    postCode: data.ClientPostCode,
                    country: data.ClientCountry,
                },
                senderAddress: {
                    street: data.streetAdress,
                    city: data.City,
                    postCode: data.Postcode,
                    country: data.Country,
                },
                status: status,
                items: items,
                paymentDue: Paymentdue(watched.InvoiceDate,data.PaymentTerm),
                description: data.ProjectDes,
                paymentTerms: data.PaymentTerm,
                total: getTotalSum(items)
            };
            console.log(invoiceData)

    try {
        await addInvoiceForCurrentUser(invoiceData);
        // Handle successful invoice submission, e.g., show a success message or redirect
        setMod(!mod)
        console.log(userData) // problem here stay null should not 
    } catch (error) {
        // Handle errors, e.g., show an error message
        console.error("Error adding invoice: ", error);
        return;
    }
    setIsNew(false)
        }

        const addItem = () => {
            setItems([...items, { name: "", qty: "", price: "", total:"" }]);
        };
        const deleteItem = (itemIndex: number) => {
            setItems(items.filter((_, index) => index !== itemIndex));
        };
        
            
        return (
        <div className={`${styles.Background} ${isLight?styles.light:styles.dark}`} 
        style={{
            display: isNew ? 'flex' : 'none'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if(e.target === e.currentTarget) {
                // perform an action if the event target is the current target
                setIsNew(false)
            }
        }}
        >
            <div className={styles.EditInvoice} ref={editInvoiceRef} 
            style={{
            display: isNew ? 'flex' : 'none'
        }}
        >
                <div className={styles.EditInvoiceTitle}>
                    <p className={styles.EditText}>
                        New Invoice
                    </p>
                </div>
                <form action="" className={styles.EditForm} onSubmit={handleSubmit(submitData)}>
                    <div className={styles.BillFrom}>
                        <h2 className={styles.EditH2}>
                            Bill From
                        </h2>
                        <label htmlFor="" className={`${styles.EditLabel}`} style={errors.streetAdress ? { color: '#EC5757' } : {}}>
                            Street Adress
                            <input className={styles.EditInput} type="text"
                            style={errors.streetAdress ? { border: '1px solid #EC5757' } : {}}
                            {...register("streetAdress")} 
                            />
                            {errors.streetAdress && <p className={styles.ErrorText}>{String(errors.streetAdress.message)}</p>}
                        </label>
                        <div className={styles.EditRow}>
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel}  style={errors.City ? { color: '#EC5757' } : {}}>
                                    City
                                    <input className={styles.EditInput} type="text"
                                    style={errors.City ? { border: '1px solid #EC5757' } : {}}
                                    {...register("City")} 
                                        />
                                    {errors.City && <p className={styles.ErrorText}>{String(errors.City.message)}</p>}

                                </label>
                            </div>
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel}  style={errors.Postcode ? { color: '#EC5757' } : {}}>
                                    Post Code
                                    <input className={styles.EditInput} type="text"
                                    style={errors.Postcode ? { border: '1px solid #EC5757' } : {}}
                                    {...register("Postcode")} 
                                    />
                                    {errors.Postcode && <p className={styles.ErrorText}>{String(errors.Postcode.message)}</p>}
                                </label>
                            </div>
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel}  style={errors.Country ? { color: '#EC5757' } : {}}>
                                    Country
                                    <input className={styles.EditInput} type="text"
                                    style={errors.Country ? { border: '1px solid #EC5757' } : {}}
                                    {...register("Country")} 
                                        />
                                {errors.Country && <p className={styles.ErrorText}>{String(errors.Country.message)}</p>}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.BillFrom}>
                        <h2 className={styles.EditH2}>
                            Bill To
                        </h2>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientName ? { color: '#EC5757' } : {}}>
                            Client's Name
                            <input className={styles.EditInput} type="text" 
                            style={errors.ClientName ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientName")} 
                            />
                            {errors.ClientName && <p className={styles.ErrorText}>{String(errors.ClientName.message)}</p>}
                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientEmail ? { color: '#EC5757' } : {}}>
                            Client's Email
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientEmail ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientEmail")} 
                            />
                            {errors.ClientEmail && <p className={styles.ErrorText}>{String(errors.ClientEmail.message)}</p>}

                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientStreetAdress ? { color: '#EC5757' } : {}}>
                            Street Adress
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientStreetAdress ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientStreetAdress")} 
                            />
                            {errors.ClientStreetAdress && <p className={styles.ErrorText}>{String(errors.ClientStreetAdress.message)}</p>}
                        </label>
                        <div className={styles.EditRow} >
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel} style={errors.ClientCity ? { color: '#EC5757' } : {}}>
                                    City
                                    <input className={styles.EditInput} type="text" 
                                    {...register("ClientCity")}
                                    style={errors.ClientCity ? { border: '1px solid #EC5757' } : {}}
                                    />
                                    {errors.ClientCity && <p className={styles.ErrorText}>{String(errors.ClientCity.message)}</p>}
                                </label>
                            </div>
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel}  style={errors.ClientPostCode ? { color: '#EC5757' } : {}}>
                                    Post Code
                                    <input className={styles.EditInput} type="text" 
                                    {...register("ClientPostCode")}
                                    style={errors.ClientPostCode ? { border: '1px solid #EC5757' } : {}}
                                    />
                                    {errors.ClientPostCode && <p className={styles.ErrorText}>{String(errors.ClientPostCode.message)}</p>}
                                </label>
                            </div>
                            <div className={styles.EditCols}>
                                <label htmlFor="" className={styles.EditLabel} style={errors.ClientCountry ? { color: '#EC5757' } : {}}>
                                    Country
                                    <input className={styles.EditInput} type="text" 
                                    {...register("ClientCountry")}
                                    style={errors.ClientCountry ? { border: '1px solid #EC5757' } : {}}
                                    />
                                    {errors.ClientCountry && <p className={styles.ErrorText}>{String(errors.ClientCountry.message)}</p>}
                                </label>
                            </div>
                        </div>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ProjectDes ? { color: '#EC5757' } : {}}>
                            Projet Description
                            <input className={styles.EditInput} type="text" 
                            {...register("ProjectDes")}
                            style={errors.ProjectDes ? { border: '1px solid #EC5757' } : {}}
                            />
                            {errors.ProjectDes && <p className={styles.ErrorText}>{String(errors.ProjectDes.message)}</p>}
                        </label>
                        <div className={styles.EditRow}>
            
                                <label htmlFor="" className={styles.EditLabel}  style={errors.InvoiceDate ? { color: '#EC5757' } : {}}>
                                    Invoice Date
                                    <input type="date" className={styles.EditInput}
                                    {...register("InvoiceDate")}
                                    style={errors.InvoiceDate ? { border: '1px solid #EC5757' } : {}}
                                        />
                                    {errors.InvoiceDate && <p className={styles.ErrorText}>{String(errors.InvoiceDate.message)}</p>}

                                </label>
                                <label htmlFor="" className={styles.EditLabel} style={errors.PaymentTerm ? { color: '#EC5757' } : {}}>
                                    Payment Term
                                    <select className={styles.EditSelect}  id="" 
                                    {...register("PaymentTerm")}
                                    style={errors.PaymentTerm ? { border: '1px solid #EC5757' } : {}}

                                    >
                                        <option className={styles.EditOption} value="1">
                                            Net 1 days
                                        </option>
                                        <option className={styles.EditOption} value="7">
                                            Net 7 days
                                        </option>
                                        <option className={styles.EditOption} value="14">
                                            Net 14 days
                                        </option>
                                        <option className={styles.EditOption} value="30">
                                            Net 30 days
                                        </option>
                                    </select>
                                    {errors.PaymentTerm && <p className={styles.ErrorText}>{String(errors.PaymentTerm.message)}</p>}

                                </label>
                        </div>
                    </div>
                    <div className={styles.EditItemList}>
                        <h2 className={styles.ItemListTitle}>
                            Item List
                        </h2>
                        <div className={styles.ItemListCol}>
                            <div className={styles.EditRowItem}>
                                <label className={styles.EditLabel2} htmlFor="">Item Name</label>
                                <label className={styles.EditLabel3} htmlFor="">Qty</label>
                                <label className={styles.EditLabel3} htmlFor="">Price</label>
                                <label className={styles.EditLabel3} htmlFor="">Total</label>
                            </div>
                            {items.map((item, index) => (
                            <div className={styles.EditRow2} key={index}>
                                <input
                                className={styles.EditName}
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                    const updatedItems = [...items];
                                    updatedItems[index].name = e.target.value;
                                    setItems(updatedItems);
                                }}
                                />
                                
                                <input
                                className={styles.EditQty}
                                type="number"
                                value={item.qty}
                                onChange={(e) => {
                                    const updatedItems = [...items];
                                    updatedItems[index].qty = e.target.value;
                                    updatedItems[index].total= (parseInt(updatedItems[index].price,10) * parseInt(updatedItems[index].qty,10)).toString()
                                    setItems(updatedItems);
                                }}
                                />
                                <input
                                className={styles.EditPrice}
                                type="number"
                                value={item.price}
                                onChange={(e) => {
                                    const updatedItems = [...items];
                                    updatedItems[index].price = e.target.value;
                                    updatedItems[index].total= (parseInt(updatedItems[index].price,10) * parseInt(updatedItems[index].qty,10)).toString()
                                    setItems(updatedItems);
                                }}
                                />
                                <p className={styles.EditTotal} >
                                {parseInt(item.price,10)*parseInt(item.qty,10)}
                                </p>
                                <div className={styles.DeleteIcon} onClick={() => deleteItem(index)}>
                                <DeleteIcon />
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className={styles.AddItems} onClick={addItem}>
                            + Add New Items
                        </div>
                    </div>
                    <div className={isBottomFixed ? `${styles.Bottom} ${styles.BottomFixed}` : styles.Bottom} ref={bottomRef}>
                        <button className={styles.BottomCancel} onClick={()=>{
                            setIsNew(false)
                        }}>
                            Discard
                        </button>
                        <button type='submit' className={styles.BottomDraft}
                        onClick={()=>{
                            setStatus('draft')
                        }}
                        >
                            Save as Draft
                        </button>
                        <button type='submit' className={styles.BottomSend}
                        onClick={()=>{
                            setStatus('pending')
                        }}
                        >
                            Save & Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
        )
    }
    
    export default CreateInvoice
    