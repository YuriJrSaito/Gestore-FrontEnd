import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { sidebarDados } from './sidebarDados.js';
import { IconContext } from 'react-icons';

// IconContext.Provider value={{color: '#fff'}} #fff pode ser alterado por outras cores, apenas os icones de react-icons sofrera as alterações.
function Header() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar)

    async function logout()
    {
        localStorage.clear();
    }

    return (
        <>
        <IconContext.Provider value={{color: 'white', size: 30}}>
            <div className='navbar'>
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showSidebar} id="barras"/>
                </Link>
                <div className='logout-area'>           
                    <h1>{localStorage.getItem('login')}</h1>
                    <Link id='link' to="/" onClick={logout}>Logout</Link> 
                </div>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='nav-toggle'>
                        <Link to="#" className='menu-bars'>
                            <AiIcons.AiOutlineClose id="close"/>
                        </Link>
                    </li>
                    {sidebarDados.map((item, index) => {
                        return (
                            item.nivel <= localStorage.getItem('nivelAcesso') &&
                                <li key={index} className={item.cNome}>
                                    <Link to={item.caminho}>
                                        {item.icone}
                                        <span>{item.titulo}</span>
                                    </Link>
                                </li>
                        )
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
        </>
    );
}
export default Header;