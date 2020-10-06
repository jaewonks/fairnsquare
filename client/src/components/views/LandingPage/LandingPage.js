import React, { useEffect } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(res => console.log(res.data))
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data){
                    props.history.push("/login")
                } else {
                    alert("Fail to Sign Out")
                }
            })
    }

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
             <button onClick={onClickHandler}>Sign Out</button>
 
        </div>
    )
}

export default withRouter(LandingPage)
