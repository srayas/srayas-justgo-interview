import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { UserService } from '../service/user-service';
import { error } from 'console';
import Loader from '../componets/global/loader';

const VerifyLink = () => {
    const { token } = useParams();
    const userSvc = new UserService()
    const [isValid, setIsValid]= useState(false);

    const validate=async ()=>{
        await userSvc.validateToken().then(data=>{
            setIsValid(true)
            if(data){
                window.location.href='/'
            }
        }).catch(error=>{
            console.log("Token Expired")
        })
    }
    useEffect(()=>{
        if(token){
            localStorage.setItem('token',token)
            if(localStorage.getItem('token')!=''){
                validate();
            }
        }
    },[token])

    if(!isValid){
        return<><Loader/></>
    }
  return (
    <></>
  )
}

export default VerifyLink