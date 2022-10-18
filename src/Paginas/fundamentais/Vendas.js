import './RealizarVenda.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faLessThanEqual} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';

function Vendas()
{
    const [vendas, setVendas] = useState([]);
    const [filtro, setFiltro] = useState('');

    const [requisicao, setRequisicao] = useState(false);

    async function carregarVendas()
    {
        await api.get('/listarVendas')
        .then((response)=>{
            setVendas(response.data);
        });
    }

    async function carregarTudo()
    {
        await carregarVendas();
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function selVenda()
    {

    }

    return (
        <>
        <div className="formulario-tabela">
            <div className='titulo'>
                <h1>vendas</h1>
            </div>
            <div className='formulario-padrao-tabela'>
                <div className='inputs-buscar-fornecedores'>
                    <input type="search" value={filtro} onChange={e=>{setFiltro(e.target.value)}} placeholder='Pesquisar'></input>
                    <button>OK</button>   
                </div> 

                <div className='div-tabela'>
                    <table className='tabela'>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Código</th>
                                <th>Quantidade Estoque</th>
                                <th>Valor Unitario(R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas !== [] &&
                                vendas.map(venda =>(
                                    <tr key={venda.id} id="alterando">
                                        <td onClick={e=>selVenda(venda)}>{venda.id}</td>
                                        <td onClick={e=>selVenda(venda)}>{venda.id}</td>
                                        <td onClick={e=>selVenda(venda)}>{venda.id}</td>
                                        <td onClick={e=>selVenda(venda)}>R${venda.id}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>  
        </>
    )
}

export default Vendas;