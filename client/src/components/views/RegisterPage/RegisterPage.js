import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from './../../../_actions/user_actions'
import { withRouter } from 'react-router-dom'

function RegisterPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPW, setConfirmPW] = useState("")

    const onEmailHandler = e => {
        setEmail(e.currentTarget.value)
    }
    const onNameHandler = e => {
        setName(e.currentTarget.value)
    }

    const onPWHandler = e => {
        setPassword(e.currentTarget.value)
    }

    const onConfirmPWHandler = e => {
        setConfirmPW(e.currentTarget.value)
    }

    const onSubmitHandler = e => {
        e.preventDefault();
        //다음 단계로 넘어갈 수 없다.
        if(Password !== ConfirmPW){
            return alert("Password isn't matched")
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }

        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login')
                } else {
                    alert("Fail to sign up")
                }
            })
        }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
        }}>
            <form style={{ display:'flex', flexDirection:'column' }}
             onSubmit={onSubmitHandler}
            > 
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPWHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPW} onChange={onConfirmPWHandler} />

                <br/>
                <button type='submit'>
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
