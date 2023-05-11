import React, { createContext, useContext, useEffect, useState,ReactNode } from 'react';
import { auth, firestore } from '@/config/firebase';
import { Invoice } from '@/types/InvoiceType';
import { collection, query, where, getDocs ,doc,getDoc} from 'firebase/firestore';
import { User, getAuth } from 'firebase/auth';
import { db } from '@/config/firebase';
import { useRouter } from 'next/router';  // Import useRouter from Next.js

interface UserData {
  id: string;
  invoices: Invoice[];
}

interface UserDataContextType {
  userData: UserData | null;
  loadingUserData: boolean;
  mod: boolean;
  setMod: (mod:boolean) => void;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  invoiceId:string,
  setInvoiceId:(UserId:string) => void;
  fetchInvoice:(invoiceId: string) => Promise<Invoice | null | undefined>
}

interface UserDataProviderProps {
  children: ReactNode;
}

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loadingUserData: true,
  mod: false,
  setMod: () => {},
  invoices: [],
  setInvoices: () => {},
  invoiceId:'',
  setInvoiceId: () => {},
  fetchInvoice: async () => null
});

export const useUserData = () => {
  return useContext(UserDataContext);
};




export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  const [mod,setMod] = useState<boolean>(false);
  const [invoices,setInvoices] = useState<Invoice[]>([])
  const [invoiceId,setInvoiceId] = useState<string>('')

  const router = useRouter();  // Initialize the router

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const invoicesCollectionRef = collection(userDocRef, 'invoices');
  
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const data = userDocSnapshot.data() as Omit<UserData, 'id'>;
        setUserData({ id: auth.currentUser.uid, ...data });
      } else {
        setUserData(null);
      }
  
      const invoicesQuerySnapshot = await getDocs(invoicesCollectionRef);
      const invoices: Invoice[] = [];
      invoicesQuerySnapshot.forEach((doc) => {
        const invoiceData = doc.data() as Omit<Invoice, 'id'>;
        invoices.push({ id: doc.id, ...invoiceData });
      });
      setInvoices(invoices)
      console.log(invoices)
      setLoadingUserData(false);
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        router.push('/connexion');  // Redirect to login page
      }
    });

    return unsubscribe;  // Unsubscribe when the component unmounts
  }, [,mod]);

  const fetchInvoice = async (invoiceId: string) => {
    if (!auth.currentUser || !invoiceId) return null; // return null if invoiceId is empty
    const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
    const invoicesCollectionRef = collection(userDocRef, 'invoices');
    const invoiceDocRef = doc(invoicesCollectionRef, invoiceId);
  
    const invoiceDocSnapshot = await getDoc(invoiceDocRef);
    if (invoiceDocSnapshot.exists()) {
      const invoiceData = invoiceDocSnapshot.data() as Omit<Invoice, 'id'>;
      return { id: invoiceDocSnapshot.id, ...invoiceData };
    }
    return null;
  };
  

  

  return (
    <UserDataContext.Provider value={{ userData, loadingUserData,mod,setMod,invoices,setInvoices,invoiceId,setInvoiceId,fetchInvoice }}>
      {children}
    </UserDataContext.Provider>
  );
};


