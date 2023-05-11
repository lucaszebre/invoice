import { Invoice } from '@/types/InvoiceType';
import { auth, firestore } from '@/config/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';

export async function changeInvoiceStatus(invoiceId: string, newStatus: 'paid' | 'pending' | 'draft'): Promise<void> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const invoiceDocRef = doc(userDocRef, 'invoices', invoiceId);

    await updateDoc(invoiceDocRef, { status: newStatus });
}
