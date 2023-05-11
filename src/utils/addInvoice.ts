import { Invoice } from '@/types/InvoiceType';
import { auth, firestore, provider, db } from '@/config/firebase';
import { collection, doc, addDoc } from 'firebase/firestore';

export async function addInvoiceForCurrentUser(invoiceData: Omit<Invoice, 'id'>): Promise<void> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const invoicesCollectionRef = collection(userDocRef, 'invoices');
    await addDoc(invoicesCollectionRef, invoiceData);
}

