import { auth } from '@/config/firebase'; // import auth from your firebase.ts file
import { useRouter } from 'next/dist/client/router';


 const router = useRouter();

export const handleSignOut = async () => {
    try {
    await auth.signOut();
    router.push('/connexion')
    } catch (error) {
    console.error('Error signing out:', error);
    alert('Error signing out');
    }
};