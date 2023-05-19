import React, { useRef, useState } from 'react';
import { auth, storage } from '@/config/firebase'; // Replace with the path to your firebase.ts file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import styles from '@/styles/ProfileImageUpload.module.css'
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setMod } from '@/redux/userSlice';

const ProfileImageUpload = () => {
    const dispatch = useDispatch();
    const UserData = useSelector((state:RootState) => state.user)
    const {mod} = UserData;

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


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
            dispatch(setMod(!mod))
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
