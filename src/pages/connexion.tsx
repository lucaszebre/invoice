import React from 'react'
import Logined from '@/components/Login'
import Sidebar from '@/components/sidebar'
const Login = () => {
    return (
        <>
        <Sidebar alt={false} />
        <Logined />
        </>
    )
}

export default Login