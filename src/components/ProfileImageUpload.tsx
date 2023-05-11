import React, { useRef, useState } from 'react';
import { auth, storage } from '@/config/firebase'; // Replace with the path to your firebase.ts file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import styles from '@/styles/ProfileImageUpload.module.css'
import { useUserData } from '@/context/UserDataContext.tsx'

const ProfileImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {mod,setMod} = useUserData();

    const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
            setUploading(true);
        
            try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not logged in');
        
            const filePath = `profileImages/${auth.currentUser?.uid}`;
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, file);
        
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(user, {
                photoURL: downloadURL,
            });
        
            alert('Profile image uploaded successfully');
            } catch (error) {
            console.error('Error uploading profile image:', error);
            alert('Error uploading profile image');
            } finally {
            setUploading(false);
            }
            setMod(!mod)
        };

    return (
        <div className={styles.UploadCenter}>
        <input
            className={styles.InputUpload}
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={uploadProfileImage}
        />
        <button
            className={styles.ButtonInputUpload}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
        >
            {uploading ? 'Uploading...' : 'Upload Profile Image'}
        </button>
        </div>
    );
    };

export default ProfileImageUpload;
