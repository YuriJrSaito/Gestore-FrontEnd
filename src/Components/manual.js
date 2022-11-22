import React, { useCallback, useEffect, useState } from 'react';
import api from '../servicos/axiosAPI';
import { Link } from 'react-router-dom';
import './manual.css'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { manualDados } from './manualDados';
import { GrAppsRounded } from 'react-icons/gr';

function Manual({ativarManual, origem, lastid}) {
    const [sidebar, setSidebar] = useState(true);
    const [idUlt, setIdUlt] = useState(lastid);

    function destacar(id)
    {
        if(idUlt !== "")
        {
            if(window.document.getElementById(idUlt) !== null)
            {
                window.document.getElementById(idUlt).style.border = "";
            }
        }
        if(window.document.getElementById(id) !== null)
        {
            window.document.getElementById(id).style.border = "3px solid green";
        }
        setIdUlt(id);
    }

    return (
        <>
        <IconContext.Provider value={{color: 'black', size: 30}}>
            <div className={sidebar ? 'nav-manual active' : 'nav-manual'}>
                <ul className='nav-manual-items' onClick={e=>{ativarManual(idUlt)}}>
                    <li className='nav-toggle-manual'>
                        <Link to="#" className='menu-bars-manual'>
                            <AiIcons.AiOutlineClose id="close-manual"/>
                        </Link>
                        <p>Manual</p>
                    </li>
                </ul>
                <div className='dica'>
                    <div className='ov'>
                        <div className='manual-componente'>
                            <p>Ao clicar em "Destacar" o campo será destacado com borda na cor verde !!</p>
                        </div>
                        <div className='manual-componente'>
                            <p>Caso o campo destacado não esteja visível feche esta aba, alguns campos só estão vísiveis com o avanço do cadastro !!</p>
                        </div>
                        {manualDados.map((item, index) => {
                            return(
                                item.categoria === origem &&
                                <div key={index} className='manual-componente'>
                                    <h1>{item.titulo}</h1>
                                    <p>{item.texto}</p>
                                    {item.obrigatorio !== undefined &&
                                        <p>Obrigatório: {item.obrigatorio}</p>
                                    }
                                    {item.max !== undefined &&
                                        <p>Máximo de caracteres: {item.max}</p>
                                    }
                                    {item.botao != false &&
                                        <input id="destacar" type="button" value="Destacar" onClick={e=>{destacar(item.campo)}}></input>
                                    }
                                    
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </IconContext.Provider>
        </>
    );
}

export default Manual;