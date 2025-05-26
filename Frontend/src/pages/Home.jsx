import React from "react";
import logo from "../assets/logo.PNG"; // Adjust the path as necessary
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url('https://th.bing.com/th?q=Traffic+Signal+Light+Cartoon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247')] h-screen pt-8 flex justify-between flex-col w-full">
        <img src="\logo.png" alt="Logo" className="w-16 ml-8 " />
        <div className="bg-white pb-7  py-4 px-4">
          <h2 className="text-3xl font-bold">Get started with Get-your-ride</h2>
          <Link to='/login'className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">Continue</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
