import React , {useEffect,useState } from 'react'
import styles from '@/styles/EditInvoice.module.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { z , ZodType} from "zod";
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { updateInvoiceForCurrentUser } from '@/utils/updateInvoice';
import { Schema,Invoice } from '@/types/InvoiceType';
import { Paymentdue } from '@/utils/PaymentDue';
import { getTotalSum } from '@/utils/getTotal';
import { useDispatch,useSelector } from 'react-redux';
import store,{ RootState,AppDispatch } from '@/redux/store';
import { setIsNew ,setEdit,setInvoice} from '@/redux/invoiceSlice';
import { setMod } from '@/redux/userSlice';
import { getStatusColors } from '@/utils/getStatusColor';
import { fetchInvoice , fetchUserData} from '@/redux/userSlice';

const EditInvoice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const InvoiceId = useSelector((state:RootState) => state.user.invoiceId)

    const invoiceState = useSelector((state:RootState) => state.invoice)
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState ) => state.user)
    const { edit} = invoiceState;
    const {isLight} = Mode
    const {userData,mod,invoiceId,invoices} = UserData;
    const Invoices = useSelector((state:RootState) => state.user.invoices)
    const invoice = Invoices.find((item) => item.id == InvoiceId);
    const [isBottomFixed, setIsBottomFixed] = React.useState(false);

    const [items, setItems] = useState(invoice?.items);


    type SchemaType = z.infer<typeof Schema>;

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            streetAdress: invoice?.senderAddress.street,
            City: invoice?.senderAddress.city,
            Postcode: invoice?.senderAddress.postCode,
            Country: invoice?.senderAddress.country,
            ClientName: invoice?.clientName,
            ClientEmail: invoice?.clientEmail,
            ClientStreetAdress: invoice?.clientAddress.street,
            ClientCity: invoice?.clientAddress.city,
            ClientPostCode: invoice?.clientAddress.postCode,
            ClientCountry: invoice?.clientAddress.country,
            InvoiceDate: invoice?.createdAt,
            PaymentTerm: invoice?.paymentTerms,
            ProjectDes: invoice?.description,
        },
    });
    
    useEffect(() => {
        setValue("streetAdress", invoice?.senderAddress.street);
        setValue("City", invoice?.senderAddress.city);
        setValue("Postcode", invoice?.senderAddress.postCode);
        setValue("Country", invoice?.senderAddress.country);
        setValue("ClientName", invoice?.clientName);
        setValue("ClientEmail", invoice?.clientEmail);
        setValue("ClientStreetAdress", invoice?.clientAddress.street);
        setValue("ClientCity", invoice?.clientAddress.city);
        setValue("ClientPostCode", invoice?.clientAddress.postCode);
        setValue("ClientCountry", invoice?.clientAddress.country);
        setValue("InvoiceDate", invoice?.createdAt);
        setValue("PaymentTerm", invoice?.paymentTerms);
        setValue("ProjectDes", invoice?.description);
    }, [invoice, setValue]);
    

    


    const submitData = async (data: SchemaType) => {
        // Replace any empty strings in data with undefined
            for (let key in data) {
            if (data[key] === "") {
                data[key] = undefined;
            }
            }
        
            const watched = watch();
            
            // Prepare the invoice? data in the format expected by the function
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
            status: invoice?.status||'',
            items: items||[],
            paymentDue: Paymentdue(watched.InvoiceDate,data.PaymentTerm) || invoice?.paymentDue,
            description: data.ProjectDes,
            paymentTerms: data.PaymentTerm,
            total: getTotalSum(items?items:[])
            };
        
            console.log(invoiceData);
        
            try {
            await updateInvoiceForCurrentUser(invoiceId, invoiceData);
            // Handle successful invoice? submission, e.g., show a success message or redirect
            dispatch(setMod(!mod));
            console.log(userData); // problem here stay null should not 
            dispatch(setEdit(false))
            } catch (error) {
            // Handle errors, e.g., show an error message
            console.error("Error adding invoice?: ", error);
            return;
            }
            dispatch(fetchUserData())
            dispatch(setIsNew(false))
            ;
        };
        

    const addItem = () => {
        if(items){
            setItems([...items, { name: "", qty: "", price: "", total:"" }]);
        }
    };
    const deleteItem = (itemIndex: number) => {
        if(items){
            setItems(items.filter((_, index) => index !== itemIndex));
        }
    };


    useEffect(() => {
        setItems(invoice?.items);
        if(invoices.find((item)=>{item.id==invoiceId})){
            const currentInvoice =  invoices.find((item)=>{item.id==invoiceId})
            const {color,colorStatus} = getStatusColors(currentInvoice?.status)
        dispatch(fetchInvoice(invoiceId.toString()))
        dispatch(fetchUserData())
        }
    }, [invoice?.items]);

        return (
        <div className={`${styles.Background} ${isLight?styles.light:styles.dark}`} style={{
            display: edit ? 'flex' : 'none'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if(e.target === e.currentTarget) {
                // perform an action if the event target is the current target
                dispatch( setEdit(false))
            }
        }}
        >
            <div className={styles.EditInvoice} 
            style={{
                display: edit ? 'flex' : 'none'
            }}
            >
                <div className={styles.EditInvoiceTitle}>
                    <p className={styles.EditText}>
                        Edit
                    </p>
                    <p className={styles.EditText}>
                        <span className={styles.EditSpan}>
                            #
                        </span>
                        {
                            invoiceId
                        }
                    </p>
                </div>
                <form action="" className={styles.EditForm} onSubmit={handleSubmit(submitData)}>
                    <div className={styles.BillFrom}>
                        <h2 className={styles.EditH2}>
                            Bill From
                        </h2>
                        <label htmlFor="" className={`${styles.EditLabel}`} style={errors.streetAdress ? { color: '#EC5757' } : {}}>
                            Street Adress
                            <input 
                            className={styles.EditInput} 
                            type="text"
                            style={errors.streetAdress ? { border: '1px solid #EC5757' } : {}}
                            {...register("streetAdress")}
                            defaultValue={invoice?.senderAddress.street} // Use defaultValue instead of value
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
                                    defaultValue={invoice?.senderAddress.city}
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
                                    defaultValue={invoice?.senderAddress.postCode}
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
                                    defaultValue={invoice?.senderAddress.country}
                                    
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
                            defaultValue={invoice?.clientName}
                            
                            />
                            {errors.ClientName && <p className={styles.ErrorText}>{String(errors.ClientName.message)}</p>}
                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientEmail ? { color: '#EC5757' } : {}}>
                            Client's Email
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientEmail ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientEmail")}
                            defaultValue={invoice?.clientEmail}
                            
                            />
                            {errors.ClientEmail && <p className={styles.ErrorText}>{String(errors.ClientEmail.message)}</p>}

                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientStreetAdress ? { color: '#EC5757' } : {}}>
                            Street Adress
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientStreetAdress ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientStreetAdress")} 
                            defaultValue={invoice?.clientAddress.street}
                        
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
                                    defaultValue={invoice?.clientAddress.city}
                                
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
                                    defaultValue={invoice?.clientAddress.postCode}
                                
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
                                    defaultValue={invoice?.clientAddress.country}
                                
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
                            defaultValue={invoice?.description}
                        
                            />
                            {errors.ProjectDes && <p className={styles.ErrorText}>{String(errors.ProjectDes.message)}</p>}
                        </label>
                        <div className={styles.EditRow}>
            
                                <label htmlFor="" className={styles.EditLabel}  style={errors.InvoiceDate ? { color: '#EC5757' } : {}}>
                                    invoice? Date
                                    <input type="date" className={styles.EditInput}
                                    {...register("InvoiceDate")}
                                    style={errors.InvoiceDate ? { border: '1px solid #EC5757' } : {}}
                                    defaultValue={invoice?.createdAt}
                                    
                                        />
                                    {errors.InvoiceDate && <p className={styles.ErrorText}>{String(errors.InvoiceDate.message)}</p>}

                                </label>
                                <label htmlFor="" className={styles.EditLabel} style={errors.PaymentTerm ? { color: '#EC5757' } : {}}>
                                    Payment Term
                                    <select className={styles.EditSelect}  id="" 
                                    {...register("PaymentTerm")}
                                    style={errors.PaymentTerm ? { border: '1px solid #EC5757' } : {}}
                                    defaultValue={invoice?.paymentTerms}
                                    

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
                        
                            {items && items.map((item, index) => (
                            <div className={styles.EditRow2} key={index}>
                                <input
                                    className={styles.EditName}
                                    type="text"
                                    defaultValue={items[index]?.name || ''} 
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice?.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            name: e.target.value,
                                            total: (parseInt(updatedItems[index].price,10) * parseInt(updatedItems[index].qty,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        
                                    }}
                                />
                                <input
                                    className={styles.EditQty}
                                    type="number"
                                    defaultValue={items[index]?.qty || ''} // Add a check to make sure the item at the current index exists
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice?.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            qty: e.target.value,
                                            total: (parseInt(updatedItems[index].price,10) * parseInt(e.target.value,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        
                                    }}
                                />
                                <input
                                    className={styles.EditPrice}
                                    type="number"
                                    defaultValue={items[index]?.price || ''} // Add a check to make sure the item at the current index exists
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice?.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            price: e.target.value,
                                            total: (parseInt(e.target.value,10) * parseInt(updatedItems[index].qty,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        
                                    }}
                                />
                                <p className={styles.EditTotal}>
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
                    <div className={isBottomFixed ? `${styles.Bottom} ${styles.BottomFixed}` : styles.Bottom} >
                        <button  className={styles.BottomCancel} onClick={()=>{
                            dispatch(setMod(!mod))
                            dispatch(fetchUserData())
                            dispatch(setEdit(false))
                        }}>
                            Cancel
                        </button>
                        <button type='submit' className={styles.BottomChanges} >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
        )
    }
    
    export default EditInvoice
    