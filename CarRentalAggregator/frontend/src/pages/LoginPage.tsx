import React from 'react';
import LoginForm, { LoginFormProps } from '../components/LoginForm';

type LoginPageProps = LoginFormProps;

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthChecked }) => {
  return (
    <div>
      <LoginForm setIsAuthChecked={setIsAuthChecked} />
    </div>
  );
};

export default LoginPage;

export {};