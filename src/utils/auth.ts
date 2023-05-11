import firebase from "@/config/firebase";


export async function signUpWithEmail(email: string,password: string): Promise<firebase.User|null> {
    try {
        const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        throw new Error('Problem with mail auth');
    }
    }

export async function signInWithEmail(
    email: string,
    password: string
    ): Promise<firebase.User|null> {
    try {
        const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        throw new Error('Problem with mail auth');
    }
    }
