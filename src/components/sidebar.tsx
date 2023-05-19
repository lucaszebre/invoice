import React, { useState, useEffect } from 'react'
import styles from '@/styles/sidebar.module.css'
import Image from 'next/image'
import Avatar from '@mui/material/Avatar';
import Logout from './Modal/logout';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '@/config/firebase';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setMode } from '@/redux/modeSlice';
const sidebar = (props:{
    alt:boolean
}) => {
    const dispatch = useDispatch();
    const Mode = useSelector((state:RootState) => state.mode)
    const UserData = useSelector((state:RootState) => state.user)
    
    const {isLight} = Mode
    const [menu, setMenu] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('');  // State to hold the avatar URL
    const [isHover, setIsHover] = useState(false);

    const barStyle = isHover ? { border: '2px solid #7C5DFA' } : {};

    const {mod} = UserData;

    // Fetch the avatar URL from Firebase storage
    useEffect(() => {
        const storage = getStorage();
        const pathReference = ref(storage, `profileImages/${auth.currentUser?.uid}`);  // Replace with the path to your image

        // Get the download URL
        getDownloadURL(pathReference)
            .then((url) => {
                setAvatarUrl(url);
            }).catch((error) => {
                console.error(error);
            });
    }, [,mod]);

    return (
        <>
        <div className={styles.Sidebar}>
            <div className={styles.SidebarLogoContainer}>
                <Image src={'/image/logo2.svg'} width={30} height={30}  alt='logo-invoice' />
            </div>
            {props.alt &&
            <div className={styles.SidebarBlock}>
                {isLight ? <Image 
                onClick={() => {
                    dispatch(setMode(!isLight))
                }} 
                className={styles.SidebarToggleDark} src={'/image/icon-moon.svg'} width={20} height={20} alt='icon-moon' /> : 
                <Image 
                onClick={() => {
                    dispatch(setMode(!isLight))
                }}
                    className={styles.SidebarToggleDark} src={'/image/icon-sun.svg'} width={20} height={20} alt='icon-moon' /> }
                
                <div  onClick={() => {
                    setMenu(prevMenu => !prevMenu)
                    
                }}>
                    <Avatar
                        alt="Avatar-profile"
                        src={avatarUrl} // Use the avatarUrl from state here
                        sx={{ width: 40, height: 40 }}
                        style={barStyle} 
                        onMouseEnter={()=>{
                            setIsHover(true)
                        }} 
                        onMouseLeave={()=>{
                            setIsHover(false)
                        }}
                    />
                </div>
                {menu && <Logout />}
            </div>}
        </div>
        </>
    )
}

export default sidebar
