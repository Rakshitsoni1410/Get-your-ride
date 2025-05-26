import React from "react";
import logo from "../assets/logo.PNG"; // Adjust the path as necessary
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url('https://rhythmtraffic.com/wp-content/uploads/insync-compatible-with-all-existing-software.jpg')] h-screen pt-8 flex justify-between flex-col w-full">
        <img src="\logo.png" alt="Logo" className="w-16 ml-10 " />
        <div className="bg-white pb-7  py-4 px-4">
          <h2 className="text-3xl font-bold">Get started with Get-your-ride</h2>
          <Link to='/login'className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">Continue</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
