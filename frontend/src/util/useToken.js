import { useState } from 'react'

const useToken = () => {

    const getToken = () => {
        const userToken = sessionStorage.getItem('token')
        return userToken && userToken
    }

    const [token, setToken] = useState(getToken())

    const saveToken = (userToken) => {
        sessionStorage.setItem('token', userToken)
        setToken(userToken)
    }

    const removeToken = () => {
        sessionStorage.removeItem("token")
        setToken(null)
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}

export default useToken;