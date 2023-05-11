import React, { createContext, useState,useEffect, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { InvoiceItem } from "@/types/InvoiceType";
import { useUserData } from '@/context/UserDataContext.tsx'
import { getStatusColors } from "@/utils/getStatusColor";
// Empty invoice for initialization
const emptyInvoiceItem: InvoiceItem = {
    name: '',
    qty: '',
    price: '',
    total: ''
};

const emptyInvoice: Invoice = {
    status: '',
    id: '',
    work: '',
    SenderStreet: '',
    SenderCity: '',
    SenderPostCode: '',
    SenderCountry: '',
    DateInvoice: '',
    PaymentDue: '',
    PaymentDate: '',
    clientName: '',
    ClientStreet: '',
    ClientCity: '',
    ClientPostCode: '',
    ClientCountry: '',
    clientEmail: '',
    price: '',
    color: '',
    colorStatus: '',
    items: [],
    PaymentTerm:'1'
};

type FilterType = {
    draft:boolean,
    pending:boolean,
    paid:boolean
}

const FilterInit : FilterType ={
    draft:false,
    pending: false,
    paid : false 
}
type Invoice = {
    status:string,
    id:string,
    work:string,
    SenderStreet:string,
    SenderCity:string,
    SenderPostCode:string,
    SenderCountry:string,
    DateInvoice?:string,
    PaymentDue?:string,
    PaymentDate:string,
    clientName:string,
    ClientStreet:string,
    ClientCity:string,
    ClientPostCode:string,
    ClientCountry:string,
    clientEmail:string,
    price:string,
    color:string,
    colorStatus:string,
    PaymentTerm:string,
    items:InvoiceItem[]
};

type InvoiceContextType = {
    invoice: Invoice ;
    setInvoice: (invoice: Invoice ) => void;
    view:boolean;
    setView:Dispatch<SetStateAction<boolean>>;
    edit:boolean;
    setEdit:Dispatch<SetStateAction<boolean>>;
    isNew: boolean;  // renamed from 'new' to 'isNew'
    setIsNew: Dispatch<SetStateAction<boolean>>;  // renamed from 'setNew' to 'setIsNew'
    isdelete: boolean;
    setIsDelete: Dispatch<SetStateAction<boolean>>;
    isLight: boolean;
    setIsLight: Dispatch<SetStateAction<boolean>>;
    setMode: (mode:boolean) =>  void 
    filter:FilterType,
    setFilter: (status:FilterType) => void
};

// Use emptyInvoice in your context initialization
const InvoiceContext = createContext<InvoiceContextType>({
    invoice: emptyInvoice,
    setInvoice: () => {},
    view: false,
    setView: () => {},
    edit: false,
    setEdit: () => {},
    isNew: false,
    setIsNew: () => {},
    isdelete: false,
    setIsDelete: () => {},
    isLight: false,
    setIsLight: () => {},
    setMode:() => {},
    filter: FilterInit,
    setFilter: () => {}
});

type InvoiceProviderProps = {
    children: ReactNode;
};

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
    const [invoice, setInvoice] = useState<Invoice >(emptyInvoice);
    const [view,setView] = useState<boolean>(true);
    const [edit,setEdit] = useState<boolean>(false);
    const [isNew,setIsNew] = useState<boolean>(false);
    const [isdelete,setIsDelete] = useState<boolean>(false);
    const [isLight,setIsLight] = useState<boolean>(false);
    const [filter,setFilter] = useState<FilterType>(FilterInit)
   // Fonction pour définir et stocker le mode choisi dans le localStorage
    const setMode = (mode:boolean) => {
        setIsLight(mode);
        localStorage.setItem('mode', mode.toString());
    };

    const stringToBoolean = (str:string) => {
        return str.toLowerCase() === 'true';
    };

    useEffect(() => {
        const storedMode = localStorage.getItem('mode');
        if (storedMode) {
        const booleanValue = stringToBoolean(storedMode);
        setIsLight(booleanValue);
        }
    }, []);
    const { fetchInvoice,invoiceId } = useUserData();

    useEffect(() => {
        const fetchAndSetInvoice = async () => {
            const fetchedInvoice = await fetchInvoice(invoiceId);
            if (fetchedInvoice) {
                const { color, colorStatus } = getStatusColors(fetchedInvoice?.status);
                setInvoice({...invoice,
                    status:fetchedInvoice.status,
                    id:fetchedInvoice.id,
                    work:fetchedInvoice.description,
                    SenderStreet:fetchedInvoice.senderAddress.street,
                    SenderCity:fetchedInvoice.senderAddress.city,
                    SenderCountry:fetchedInvoice.senderAddress.country,
                    SenderPostCode:fetchedInvoice.senderAddress.postCode,
                    clientEmail:fetchedInvoice.clientEmail,
                    clientName:fetchedInvoice.clientName,
                    ClientCity:fetchedInvoice.clientAddress.city,
                    ClientCountry:fetchedInvoice.clientAddress.country,
                    ClientPostCode:fetchedInvoice.clientAddress.postCode,
                    ClientStreet:fetchedInvoice.clientAddress.street,
                    price:fetchedInvoice.total,
                    items:fetchedInvoice.items,
                    PaymentDue:fetchedInvoice.paymentDue,
                    PaymentDate:fetchedInvoice.createdAt,
                    DateInvoice:fetchedInvoice.createdAt,
                    color:color,
                    colorStatus:colorStatus
                });
                
            }
            };
        
            fetchAndSetInvoice();
        }, [invoiceId, fetchInvoice]);



    return (
        <InvoiceContext.Provider value={{ invoice, setInvoice,view,setView,edit,setEdit,isNew,setIsNew,isdelete,setIsDelete,isLight,setIsLight,setMode,filter,setFilter}}>
        {children}
        </InvoiceContext.Provider>
    );
    };

export const useInvoice = () => useContext(InvoiceContext);

