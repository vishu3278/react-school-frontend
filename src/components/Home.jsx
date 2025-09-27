// Home.js
import React from 'react';
// import { Navbar, Logo, NavigationLinks, NavLink, ButtonsContainer, LoginButton, GuestButton, HomeContainer, SchoolInfo, SchoolImage, Title, LoremTextContainer, AdminRegisterLink } from '../styles/styles'
import { LoremIpsum } from 'lorem-ipsum';
import bg from "../assets/bg.png";
import bg1 from "../assets/bg1.png";
import { Link, useNavigate } from 'react-router-dom'; 

const lorem = new LoremIpsum();

const Home = () => {
  const navigate = useNavigate();
  const loremText = lorem.generateParagraphs(2);

  const handleLoginClick = () => {
    navigate('/choose-user');
  };

  return (
    <>
      <nav className="bg-slate-200 flex items-center justify-between gap-4 px-5">
        <img src={bg1} alt="Logo" className="h-12" />
        <div className="inline-flex gap-3">
          <a href="#" className="button bg-slate-300">About Us</a>
          <a href="#" className="button bg-slate-300">Products</a>
          <a href="#" className="button bg-slate-300">Contact Us</a>
        </div>
        <div>
          <button className="bg-amber-300 mx-3" onClick={handleLoginClick}>Sign In</button>
          <button className="bg-amber-300" onClick={handleLoginClick}>Guest Mode</button>
        </div>
      </nav>
      <div className="p-5">
        <div className="text-center mb-16">
          <h1 className="text-6xl">School Management System</h1>
          <div className="my-10 max-w-4xl mx-auto">
            <p>{loremText}</p>
          </div>
          <Link to="/admin/register" className="button bg-amber-400 text-lg">Admin Register</Link>
        </div>
        <img src={bg} alt="pupils" className="mx-auto" />
      </div>
    </>
  );
};

export default Home;
