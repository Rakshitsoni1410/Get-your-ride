import React from "react";
import logo from "../assets/logo.PNG"; // Adjust the path as necessary
const Home = () => {
  return (
    <div className="h-screen flex justify-between flex-col w-full bg-red-400">
      <img src="\logo.png" alt="Logo" className="top-0 left-0 m-9 w-19 h-19 object-contain" />
      <div className="bg-white p-4 text-center">
        <h2 className="text-xl font-semibold">Get started with Get-your-ride</h2>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Continue</button>
      </div>
    </div>
  );
};

export default Home;
