import React, { useEffect } from "react";
import LoginForm from "../componets/login/login-form";

const LoginPage = () => {
  
  return (
    <div className="login-page" style={{
        display:'flex',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
        }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
