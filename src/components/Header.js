import React from 'react'
import EDULINKS from '../Images/EDULINKS 1.png';
import { useNavigate,useLocation } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();
    const location = useLocation();

    const showLogout = location.pathname === '/admin-panel'
    function handleLogout() {
        console.log("Hi you are logged out");
        localStorage.removeItem("authToken");
        navigate('/admin-panel');
    }

    return (
        <header className="py-3 md:py-1 fixed w-full z-50 top-0 bg-white shadow-md flex flex-wrap items-center">
            <div className='container mx-auto flex items-center gap-7 2xl:gap-14 justify-between'>
                <a href='https://edulinks.io/' className='site_logo'>
                    <img
                        src={EDULINKS}
                        alt="EDULINK-logo"
                        className="w-28 h-10 md:w-full md:h-full"

                    />
                </a>
                {!showLogout &&
                    (
                        <div
                            className="flex justify-center items-center text-base rounded-md cursor-pointer font-bold font-robotoCondensed"
                            onClick={handleLogout}
                        >
                            <div className="flex items-center justify-center h-7 w-7">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="https://www.w3.org/2000/svg"
                                    className="h-5 w-5 shrink-0"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            Logout
                        </div>
                    )}
            </div>
        </header>
    )
}

export default Header