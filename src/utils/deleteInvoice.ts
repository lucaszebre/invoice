import { Invoice } from '@/types/InvoiceType';
import { auth, firestore, provider, db } from '@/config/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';

export async function deleteInvoiceForCurrentUser(invoiceId: string): Promise<void> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const invoiceDocRef = doc(userDocRef, 'invoices', invoiceId);
    
    await deleteDoc(invoiceDocRef);
}
