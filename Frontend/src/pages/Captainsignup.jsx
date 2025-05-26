import React, { useState } from 'react'; // ✅ Import useState
import { Link } from 'react-router-dom';

const Captainsignup = () => {
  // ✅ Define state variables
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setuserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();

    const submittedData = {
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    };

    console.log('Form submitted:', submittedData);
    setuserData(submittedData);

    // Clear inputs
    setemail('');
    setpassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="w-16 mb-10" />

        {/* Signup Form */}
        <form onSubmit={submitHandler}>
          {/* Name Inputs */}
          <h3 className='text-lg font-medium mb-2'>What's our Captain's  name</h3>
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

          {/* Email Input */}
          <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder="r@gmail.com"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

          {/* Password Input */}
          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-base'
          >
            Sign up
          </button>
        </form>

        {/* Navigation Link */}
        <p className='text-center'>
          Already have an account?
          <Link to='/captain-login' className='text-blue-600'> Login here</Link>
        </p>
      </div>

      {/* Footer Text */}
      <div>
        <p className='text-xs leading-5 text-center mb-3'>
          By proceeding, you agree to our policy and terms of service.
        </p>
      </div>
    </div>
  );
};

export default Captainsignup;
