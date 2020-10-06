import React, { useEffect } from 'react'
import axios from 'axios'

function LangindPage() {

    useEffect(() => {
        axios.get('/api/hello')
        .then(res => console.log(res.data))
    }, [])

    return (
        <div>
             LangindPage
        </div>
    )
}

export default LangindPage
