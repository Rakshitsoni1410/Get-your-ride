import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/userContext'; // ✅ Correct import
import.meta.env.VITE_BASE_URL
const UserSignup = () => {
  // State variables
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext); // ✅ Correct useContext usage

  // Form submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        fullName: {
          firstName,
          lastName
        },
        email,
        password
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        navigate('/home'); // ✅ Redirect to home
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      alert('Signup failed. Please try again.');
    }

    // Clear input fields
    setemail('');
    setpassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="w-16 mb-10" />

        {/* Signup Form */}
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2 w-full'>What's your name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder="r@gmail.com"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-base'
          >
            Sign up
          </button>
        </form>

        <p className='text-center'>
          Already have an account?
          <Link to='/login' className='text-blue-600'> Login here</Link>
        </p>
      </div>

      <div>
        <p className='text-xs leading-5 text-center mb-3'>
          This is a demo app for educational purposes. Please do not use real credentials.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
