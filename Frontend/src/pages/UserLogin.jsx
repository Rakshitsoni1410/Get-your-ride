import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setuserData] = useState({})
  const submitHandler = (e) => {
    e.preventDefault();
    setuserData({
      email: email,
      password: password
    }) 
    setEmail('');
    setPassword('');
  };
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img src="/logo.png" alt="Logo" className="w-16 mb-10" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder="r@gmail.com"
            required
          />

          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder="password"
            required
          />

          <button
            type="submit"
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            Login
          </button>
        </form>

        <p className='text-center'>
          New here?
          <Link to='/signup' className='text-blue-600'> Create new account</Link>
        </p>
      </div>
      <div>
        <Link to='/captain-login' className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg'>
          Sign in as captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
