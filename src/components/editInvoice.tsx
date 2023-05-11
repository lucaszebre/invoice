import React , {useRef,useEffect,useState } from 'react'
import styles from '@/styles/EditInvoice.module.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { useInvoice } from '@/context/InvoiceContext';  // import the useInvoice hook
import { z , ZodType} from "zod";
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { useUserData } from '@/context/UserDataContext.tsx'
import { updateInvoiceForCurrentUser } from '@/utils/updateInvoice';
import { Invoice } from '@/types/InvoiceType';

const EditInvoice = () => {

        
    const {isNew,setIsNew,isLight,setEdit,edit,invoice,setInvoice} = useInvoice();  // use the hook
    const {userData,setMod,mod,invoiceId,invoices} = useUserData();


    const [isBottomFixed, setIsBottomFixed] = React.useState(false);

    const [items, setItems] = useState(invoice.items);

    const getSchema = () => z.object({
        streetAdress:z.string().min(1,'must put a adress').default(invoice.SenderStreet),
        City:z.string().min(1,'must put a city').max(30,'the city is too long').default(invoice.SenderCity),
        Postcode:z.string().min(3,'the postcode is too short').max(5,'the postcode is too long').default(invoice.SenderPostCode),
        Country:z.string().min(1,'the country is too short').max(15,'the country is too long').default(invoice.SenderCountry),
        ClientName:z.string().min(1,'clientName is too shorts').max(30,'client Name is too long').default(invoice.clientName),
        ClientEmail:z.string().email('your email is not well formated').default(invoice.clientEmail),
        ClientStreetAdress:z.string().min(1,'must put the clien adress').default(invoice.ClientStreet),
        ClientCity:z.string().min(1,'must put the client city').max(30,'the client city is too long').default(invoice.ClientCity),
        ClientPostCode:z.string().min(1, 'must put the client post code').max(5,' too long').default(invoice.ClientPostCode),
        ClientCountry:z.string().min(1,'must put a client country').max(30,'the client country is too long').default(invoice.ClientCountry),
        InvoiceDate: z.string().default(invoice.PaymentDate),
        PaymentTerm:z.string().min(1,'must choose the paymentTerm').max(30,'your paymentTerm is too long').default(invoice.PaymentTerm),
        ProjectDes:z.string().min(1,'must put your project description').max(30,'your description is too long').default(invoice.work),
    });
    
    const Schema : ZodType = z.object({
        streetAdress:z.string().min(1,'must put a adress'),
        City:z.string().min(1,'must put a city').max(30,'the city is too long'),
        Postcode:z.string().min(3,'the postcode is too short').max(5,'the postcode is too long'),
        Country:z.string().min(1,'the country is too short').max(15,'the country is too long'),
        ClientName:z.string().min(1,'clientName is too shorts').max(30,'client Name is too long'),
        ClientEmail:z.string().email('your email is not well formated').default(invoice.clientEmail),
        ClientStreetAdress:z.string().min(1,'must put the clien adress').default(invoice.ClientStreet),
        ClientCity:z.string().min(1,'must put the client city').max(30,'the client city is too long'),
        ClientPostCode:z.string().min(1, 'must put the client post code').max(5,' too long'),
        ClientCountry:z.string().min(1,'must put a client country').max(30,'the client country is too long'),
        InvoiceDate: z.string(),
        PaymentTerm:z.string().min(1,'must choose the paymentTerm').max(30,'your paymentTerm is too long'),
        ProjectDes:z.string().min(1,'must put your project description').max(30,'your description is too long'),
    })


    type SchemaType = z.infer<typeof Schema>;


    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            streetAdress: invoice.SenderStreet,
            City: invoice.SenderCity,
            Postcode: invoice.SenderPostCode,
            Country: invoice.SenderCountry,
            ClientName: invoice.clientName,
            ClientEmail: invoice.clientEmail,
            ClientStreetAdress: invoice.ClientStreet,
            ClientCity: invoice.ClientCity,
            ClientPostCode: invoice.ClientPostCode,
            ClientCountry: invoice.ClientCountry,
            InvoiceDate: invoice.PaymentDate,
            PaymentTerm: invoice.PaymentTerm,
            ProjectDes: invoice.work,
        },
    });
    
    useEffect(() => {
        setValue("streetAdress", invoice.SenderStreet);
        setValue("City", invoice.SenderCity);
        setValue("Postcode", invoice.SenderPostCode);
        setValue("Country", invoice.SenderCountry);
        setValue("ClientName", invoice.clientName);
        setValue("ClientEmail", invoice.clientEmail);
        setValue("ClientStreetAdress", invoice.ClientStreet);
        setValue("ClientCity", invoice.ClientCity);
        setValue("ClientPostCode", invoice.ClientPostCode);
        setValue("ClientCountry", invoice.ClientCountry);
        setValue("InvoiceDate", invoice.PaymentDate);
        setValue("PaymentTerm", invoice.PaymentTerm);
        setValue("ProjectDes", invoice.work);
    }, [invoice, setValue]);
    
    function isValidDate(date: any): boolean {
        return date instanceof Date && !isNaN(date.getTime());
        }
    

    function Paymentdue(date1:string,days:string){
        // Convert the date1 string into a Date object
        let dueDate = new Date(date1);
        // Add the number of days to the Date object
        dueDate.setDate(dueDate.getDate() + parseInt(days, 10));
        if (dueDate && isValidDate(dueDate)) {
            // Format the date into "YYYY-MM-DD" format
            let formattedDate = dueDate.toISOString().slice(0, 10);
            return formattedDate;
            } else {
            return;
            }
        
    }

    function getTotalSum(items: { name: string, qty: string, price: string, total: string }[]) {
        let total = 0;
        items.forEach(item => {
            total += Number(item.price) * Number(item.qty);
        });
    
        // Return as string
        return total.toFixed(2); // It will round the number to 2 decimal places
    }

    const submitData = async (data: SchemaType) => {
        // Replace any empty strings in data with undefined
            for (let key in data) {
            if (data[key] === "") {
                data[key] = undefined;
            }
            }
        
            const watched = watch();
            
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
            status: invoice.status,
            items: items,
            paymentDue: Paymentdue(watched.InvoiceDate,data.PaymentTerm) || invoice.PaymentDue,
            description: data.ProjectDes,
            paymentTerms: data.PaymentTerm,
            total: getTotalSum(items)
            };
        
            console.log(invoiceData);
        
            try {
            await updateInvoiceForCurrentUser(invoiceId, invoiceData);
            // Handle successful invoice submission, e.g., show a success message or redirect
            setMod(!mod);
            console.log(userData); // problem here stay null should not 
            setEdit(false);
            } catch (error) {
            // Handle errors, e.g., show an error message
            console.error("Error adding invoice: ", error);
            return;
            }
            setIsNew(false);
        };
        

    const addItem = () => {
        setItems([...items, { name: "", qty: "", price: "", total:"" }]);
    };
    const deleteItem = (itemIndex: number) => {
        setItems(items.filter((_, index) => index !== itemIndex));
    };
    console.log(items)

    useEffect(() => {
        setItems(invoice.items);
    }, [invoice.items]);

        return (
        <div className={`${styles.Background} ${isLight?styles.light:styles.dark}`} style={{
            display: edit ? 'flex' : 'none'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if(e.target === e.currentTarget) {
                // perform an action if the event target is the current target
                setEdit(false)
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
                            defaultValue={invoice.SenderStreet} // Use defaultValue instead of value
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
                                    defaultValue={invoice.SenderCity}
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
                                    defaultValue={invoice.SenderPostCode}
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
                                    defaultValue={invoice.SenderCountry}
                                    
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
                            defaultValue={invoice.clientName}
                            
                            />
                            {errors.ClientName && <p className={styles.ErrorText}>{String(errors.ClientName.message)}</p>}
                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientEmail ? { color: '#EC5757' } : {}}>
                            Client's Email
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientEmail ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientEmail")}
                            defaultValue={invoice.clientEmail}
                            
                            />
                            {errors.ClientEmail && <p className={styles.ErrorText}>{String(errors.ClientEmail.message)}</p>}

                        </label>
                        <label htmlFor="" className={styles.EditLabel}  style={errors.ClientStreetAdress ? { color: '#EC5757' } : {}}>
                            Street Adress
                            <input className={styles.EditInput} type="text"
                            style={errors.ClientStreetAdress ? { border: '1px solid #EC5757' } : {}}
                            {...register("ClientStreetAdress")} 
                            defaultValue={invoice.ClientStreet}
                        
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
                                    defaultValue={invoice.ClientCity}
                                
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
                                    defaultValue={invoice.ClientPostCode}
                                
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
                                    defaultValue={invoice.ClientCountry}
                                
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
                            defaultValue={invoice.work}
                        
                            />
                            {errors.ProjectDes && <p className={styles.ErrorText}>{String(errors.ProjectDes.message)}</p>}
                        </label>
                        <div className={styles.EditRow}>
            
                                <label htmlFor="" className={styles.EditLabel}  style={errors.InvoiceDate ? { color: '#EC5757' } : {}}>
                                    Invoice Date
                                    <input type="date" className={styles.EditInput}
                                    {...register("InvoiceDate")}
                                    style={errors.InvoiceDate ? { border: '1px solid #EC5757' } : {}}
                                    defaultValue={invoice.DateInvoice}
                                    
                                        />
                                    {errors.InvoiceDate && <p className={styles.ErrorText}>{String(errors.InvoiceDate.message)}</p>}

                                </label>
                                <label htmlFor="" className={styles.EditLabel} style={errors.PaymentTerm ? { color: '#EC5757' } : {}}>
                                    Payment Term
                                    <select className={styles.EditSelect}  id="" 
                                    {...register("PaymentTerm")}
                                    style={errors.PaymentTerm ? { border: '1px solid #EC5757' } : {}}
                                    defaultValue={invoice.PaymentTerm}
                                    

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
                                    defaultValue={items[index]?.name || ''} 
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            name: e.target.value,
                                            total: (parseInt(updatedItems[index].price,10) * parseInt(updatedItems[index].qty,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        setInvoice({
                                            ...invoice,
                                            items:updatedItems
                                        }
                                        )
                                    }}
                                />
                                <input
                                    className={styles.EditQty}
                                    type="number"
                                    defaultValue={items[index]?.qty || ''} // Add a check to make sure the item at the current index exists
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            qty: e.target.value,
                                            total: (parseInt(updatedItems[index].price,10) * parseInt(e.target.value,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        setInvoice({
                                            ...invoice,
                                            items:updatedItems
                                        })
                                    }}
                                />
                                <input
                                    className={styles.EditPrice}
                                    type="number"
                                    defaultValue={items[index]?.price || ''} // Add a check to make sure the item at the current index exists
                                    onChange={(e) => {
                                        let updatedItems = [...items]; // Use items instead of invoice.items
                                        updatedItems[index] = {
                                            ...updatedItems[index],
                                            price: e.target.value,
                                            total: (parseInt(e.target.value,10) * parseInt(updatedItems[index].qty,10)).toString()
                                        };
                                        setItems(updatedItems);
                                        setInvoice({
                                            ...invoice,
                                            items:updatedItems
                                        })
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
                            setMod(!mod)
                            setEdit(false)
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
    