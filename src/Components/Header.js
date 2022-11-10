import React, { useState } from 'react';
import api from '../servicos/axiosAPI';
import { Link } from 'react-router-dom';
import './Header.css'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { sidebarDados } from './sidebarDados.js';
import { IconContext } from 'react-icons';

/*
                <div className='logout-area'>           
                    <h1>{localStorage.getItem('login')}</h1>
                    <Link id='link' to="/" onClick={logout}>Logout</Link> 
                </div>
*/
// IconContext.Provider value={{color: '#fff'}} #fff pode ser alterado por outras cores, apenas os icones de react-icons sofrera as alterações.
function Header() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar)

    const [sidebarProduto, setSidebarProduto] = useState(false);
    const showSidebarProduto = () => setSidebarProduto(!sidebarProduto)

    const [sidebarCadastro, setSidebarCadastro] = useState(false);
    const showSidebarCadastro = () => setSidebarCadastro(!sidebarCadastro)

    const [sidebarUsuario, setSidebarUsuario] = useState(false);
    const showSidebarUsuario = () => setSidebarUsuario(!sidebarUsuario)

    const [sidebarVenda, setSidebarVenda] = useState(false);
    const showSidebarVenda = () => setSidebarVenda(!sidebarVenda)

    const [sidebarVendaCond, setSidebarVendaCond] = useState(false);
    const showSidebarVendaCond = () => setSidebarVendaCond(!sidebarVendaCond)

    const [areaUsuario, setAreaUsuario] = useState(false);
    const showArea = () => setAreaUsuario(!areaUsuario);

    /*async function logout()
    {
        try{
            await api.post(`/logout`)
            .then(
                response => {
                    console.log(response.data);
                }
            )
            localStorage.clear();
        }
        catch(err){
            console.log(err);
        }
    }*/

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

                <Link to="#" className="menu-bars">
                    <FaIcons.FaUserCircle onClick={showArea} id="area"/>
                </Link>

                {areaUsuario && 
                    <div className={areaUsuario ? 'area-user active' : 'area-user'}>
                        <div className='area-items'>
                            <h1>{localStorage.getItem('login')}</h1>
                            <Link id='link' to="/" onClick={logout}>Logout</Link> 
                        </div>
                    </div>
                }
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
                            localStorage.getItem("nivelAcesso") >= item.nivel &&
                                <li key={index} className={item.cNome}>
                                    <Link to={item.caminho}>
                                        {item.icone}
                                        <span>{item.titulo}</span>
                                    </Link>
                                </li>
                        )
                    })}
                    <li>
                        <Link to='#' className='nav-text'>
                            <span>&nbsp;</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </IconContext.Provider>
        </>
    );
}

export default Header;