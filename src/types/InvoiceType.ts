import { z , ZodType} from "zod";

export type Address = {
        street: string;
        city: string;
        postCode: string;
        country: string;
    };
    
    export type InvoiceItem = {
        name: string;
        qty: string;
        price: string;
        total: string;
    };
    
    export type Invoice = {
        id: string;
        createdAt: string;
        paymentDue?: string;
        description: string;
        paymentTerms: number;
        clientName: string;
        clientEmail: string;
        status: string;
        senderAddress: Address;
        clientAddress: Address;
        items: InvoiceItem[];
        total: string;
    };


 export   const Schema : ZodType = z.object({
        streetAdress:z.string().min(1,'must put a adress'),
        City:z.string().min(1,'must put a city').max(30,'the city is too long'),
        Postcode:z.string().min(3,'the postcode is too short').max(5,'the postcode is too long'),
        Country:z.string().min(1,'the country is too short').max(15,'the country is too long'),
        ClientName:z.string().min(1,'clientName is too shorts').max(30,'client Name is too long'),
        ClientEmail:z.string().email('your email is not well formated'),
        ClientStreetAdress:z.string().min(1,'must put the clien adress'),
        ClientCity:z.string().min(1,'must put the client city').max(30,'the client city is too long'),
        ClientPostCode:z.string().min(1, 'must put the client post code').max(5,' too long'),
        ClientCountry:z.string().min(1,'must put a client country').max(30,'the client country is too long'),
        InvoiceDate: z.string(),
        PaymentTerm:z.string().min(1,'must choose the paymentTerm').max(30,'your paymentTerm is too long'),
        ProjectDes:z.string().min(1,'must put your project description').max(30,'your description is too long'),
    })


export  const CreateSchema : ZodType = z.object({
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





export type FilterType = {
    draft: boolean;
    pending: boolean;
    paid: boolean;
    };
    
export interface UserData {
    id: string;
    invoices: Invoice[];
    }
    