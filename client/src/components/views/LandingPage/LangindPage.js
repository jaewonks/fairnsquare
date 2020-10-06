import React, { useEffect } from 'react'
import axios from 'axios'

function LangindPage() {

    useEffect(() => {
        axios.get('/api/hello')
        .then(res => console.log(res.data))
    }, [])

    return (
        <div
            style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
        }}
        >
             <h2>LangindPage</h2>
        </div>
    )
}

export default LangindPage
