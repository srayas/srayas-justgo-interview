import React, { useEffect, useState } from 'react';
import './login-form.css';
import { useForm } from 'react-hook-form';
import { LoginFormType } from '../../types/login-form';
import bcrypt from 'bcryptjs';
import { UserService } from '../../service/user-service';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../providers/AppProvider';
import { User } from '../../model/user';
import Loader from '../global/loader';

const LoginForm = () => {
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const navigate = useNavigate();
  const [show ,setShow] = useState(true)
 const {appData,setAppData}= useAppData()
  const userSvc = new UserService();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginFormType>({ mode: 'onSubmit' });

  const onSubmit = async (data: LoginFormType) => {
    if (isRequestingLink) {
      console.log("Requesting Magic Link for:", data.username);
      await userSvc.generatreMagicLink(data).then(data=>{
        if(data){
          setShow(false)
          window.location.href=data
        }
      }).catch(error=>{
        console.log("Authentication Error",error)
      })
      
    } else {
      if(data.password){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const payload:LoginFormType={
          username:data.username,
          password:hashedPassword
        }
        try {
          await userSvc.authenticateUser(payload).then(data=>{
            if(data.token){
              localStorage.setItem('token',data.token)
              window.location.href = '/';
            }
          }).catch(error=>{
            console.log("Authentication Error",error)
          })
        } catch (error) {
          console.error("Authentication Error")
        }
      }
      
    }
  };

  useEffect(()=>{
    clearErrors()
  },[isRequestingLink])

  useEffect(()=>{
    if(!appData.isLoggedIn){
      localStorage.setItem('token','')
      setAppData(prevState => ({
        ...prevState,
        isLoggedIn: false,
        user:new User()
      }));
    }
  },[])

if(!show){
  return (<><Loader/></>)
}

  return (
    <>
    {show &&<div id="login-form" className="main">
      <h1>Just Go Interview</h1>
      <h3>{isRequestingLink ? "Get Magic Link" : "Login with Password"}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Email ID / Mobile No:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your email or mobile"
          {...register("username", {
            required: "Username is required",
            validate: {
                emailOrMobile: value =>
                  emailRegex.test(value) || mobileRegex.test(value) || "Please enter a valid email or mobile number"
              }
          })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        {!isRequestingLink && (
          <>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: passwordRegex,
                  message: "Password must be at least 8 characters long, include a letter,includes a upper case letter, a number, and a special character"
                }
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </>
        )}
        <div className="wrap">
          <button type="submit">{isRequestingLink ? "Send Magic Link" : "Login"}</button>
        </div>
      </form>
      <p onClick={() => setIsRequestingLink(!isRequestingLink)} className="toggle-link">
        {isRequestingLink ? "Back to Login" : "Get Magic Link Instead"}
      </p>
    </div>}
    </>
    
  );
};

export default LoginForm;
