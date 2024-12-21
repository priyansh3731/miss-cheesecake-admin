import "../css/navbar.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import menu from "../assets/menu.png";
import { auth } from "../config";

const Navbar = () => {
    const navigate = useNavigate();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="nav-container">
              <>
                <nav className="navbar">
                    <div className='logo'>
                    <img
                            src={menu}
                            width={20}
                            onClick={toggleSidebar}
                            alt="Menu"
                        />
                        <div style={{width:"20px"}}></div>
                        <img
                            src={logo}
                            width={80}
                            alt="Logo"
                            onClick={() => { navigate("/") }}
                        />
                    </div>

                </nav>
                <div className={`${isSidebarOpen ? 'open' : 'sidebar2'}`}>
                    <button className="close-btn" onClick={toggleSidebar}>X</button>
                    <ul className="nav-lists">
                        <li onClick={() => { navigate("/") }}>Home</li>
                        <li onClick={() => { navigate("/products") }}>Products</li>
                        <li onClick={() => { navigate("/orders") }}>Orders</li>
                        <li onClick={()=> {auth.signOut()}}>Sign Out</li>
                    </ul>
                </div>
                </>
        </div>
    );
}

export default Navbar;
