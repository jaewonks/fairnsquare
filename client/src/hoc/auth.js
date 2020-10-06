import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_actions'


export default function (SpecificComponent, option, adminRoute = null) {
    // null 아무나 출입 가능
    // true 로그인한 유저만 출입
    // false 로그인한 유저는 출입 불가

    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            //페이지가 이동할때마다 백엔드에 요청을 보내서 확인하고 있는 것
            dispatch(auth()).then(response => {
                //console.log(response)
                //로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                } else {
                    //로그인한 상태
                    if(adminRoute && !response.payload.isAdmin){ //어드민이 아닌데 어드민만 모드에 들어갈 때
                        props.history.push('/')
                    } else {
                        if(option === false) //로그안한 유저 출입 불가 페이지
                            props.history.push('/')
                    }
                }
            })
        },[])
        return( <SpecificComponent/>
        )
    }    
    return AuthenticationCheck 
}



