import React, { useState } from 'react';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BsGraphUp, BsPeople, BsPerson, BsFileText, BsBook, BsGraphDown, BsCalendar, BsGear, BsChatDots, BsCalendarEvent, BsQuestionSquare } from 'react-icons/bs';
import logo from '../../assets/JD-Logo.jpg'
import '../../styles/Sidebar.css'

/*const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #2c3e50; 
  color: white;
  overflow-y: auto; 
  padding-top: 60px;
  transition: width 0.3s ease; 
  z-index: 100; 
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
`;

const li = styled.li`
  display: flex;
  align-items: center;
  font-size: 18px;
  border-bottom: 1px solid #34495e; 
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 10px 20px 10px 0;
  flex-grow: 1;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #34495e; 
  }
`;

const SidebarIcon = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

const Logo = styled.img`
  width: 50px;
  height: auto;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleIcon = styled.span`
  color: white;
  font-size: 20px;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;*/

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    /*const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };*/

    return (
        <aside className="sidebar bg-gradient-to-b from-white to-slate-200" >
          <figure>
            <img src={logo} alt="Logo" className="max-w-64 mx-auto" />
          </figure>
          <ul className="sticky top-0">
            <li>
              <div><BsGraphUp /></div>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <div><BsPeople /></div>
              <Link to="/admin/classes">Classes</Link>
            </li>
            <li>
              <div><BsPeople /></div>
              <Link to="/admin/subjects">Subjects</Link>
            </li>
            <li>
              <div><BsPeople /></div>
              <Link to="/admin/students">Students</Link>
            </li>
            <li>
              <div><BsPerson /></div>
              <Link to="/admin/teachers">Teachers</Link>
            </li>
            <li>
              <div><BsFileText /></div>
              <Link to="/admin/assignments">Assignments</Link>
            </li>
            <li>
              <div><BsBook /></div>
              <Link to="/admin/exams">Exams</Link>
            </li>
            <li>
              <div><BsGraphDown /></div>
              <Link to="/admin/performance">Performance</Link>
            </li>
            <li>
              <div><BsCalendar /></div>
              <Link to="/admin/attendance">Attendance</Link>
            </li>
            <li>
              <div><BsBook /></div>
              <Link to="/admin/library">Library</Link>
            </li>
            <li>
              <div><BsChatDots /></div>
              <Link to="/admin/communication">Announcement</Link>
            </li>
            <li>
              <div><BsCalendarEvent /></div>
              <Link to="/admin/events">Events & Calendar</Link>
            </li>
            <li>
              <div><BsGear /></div>
              <Link to="/admin/settings">Settings & Profile</Link>
            </li>
          </ul>
            {/*<ToggleButton onClick={toggleSidebar}>
              <ToggleIcon isOpen={isOpen}>▲</ToggleIcon>
            </ToggleButton>*/}
        </aside>
    );
};

export default Sidebar;