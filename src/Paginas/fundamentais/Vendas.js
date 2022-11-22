import './RealizarVenda.css';
import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import Manual from '../../Components/manual.js'

function Vendas({childToParent})
{
    const [vendas, setVendas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [formSelProdutos, setFormSelProdutos] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState(0);
    const [manual, setManual] = useState(false);
    const [ultimoId, setUltimoId] = useState('');

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
    
    function clicar()
    {
        if(formSelProdutos === false)
        {
            setFormSelProdutos(true);
            return true;
        }
        else
        {
            setFormSelProdutos(false);
            return false;
        }            
    }

    async function filtrarClientes()
    {
        var input, filter, table, tr, td, i, txtValue;

        input = document.getElementById("filtro");
        filter = input.value.toUpperCase();

        table = document.getElementById("table");
        tr = table.getElementsByTagName("tr");

        for (i=0; i<tr.length; i++) 
        {
            td = tr[i].getElementsByTagName("td")[0];
            if(td) 
            {
                txtValue = td.textContent || td.innerText;
                if(txtValue.toUpperCase().indexOf(filter) > -1 || filter === "") 
                {
                    tr[i].style.display = "";
                } 
                else 
                {
                    tr[i].style.display = "none";
                }
            }       
        }        
    }

    async function definirExclusao(idVenda)
    {
        
    }

    const ativarManual = (id) => {
        setUltimoId(id);
        setManual(!manual);
    }

    return (
        <>
        {manual === true &&
            <Manual ativarManual={ativarManual} origem={"cadVendasTabela"} lastid={ultimoId}/>
        }
        <div className="background-tabelas">
            <div className="formulario-tabela">
                <div className='titulo-cadastro'>
                    <div className='titulo'>
                        <h1>vendas</h1>
                    </div>
                    <div className='titulo-botoes'>
                        <input type="button" value="Realizar Venda" onClick={()=>childToParent(clicar())}></input>
                        <input type="button" value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                    </div>
                </div>
                
                <div className='formulario-padrao-tabela'>
                    <div className='inputs-buscar'>
                        <select id='sel-filtro' className='filtroSelect' value={tipoFiltro} onChange={e=>{setTipoFiltro(e.target.value)}}>
                            <option key={0} value={0}>Cliente</option>
                            <option key={1} value={1}>Funcionário</option>
                        </select>

                        <input type="search" id="filtro" value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarClientes()}} placeholder='Pesquisar'></input>
                        <input type="button" id='recarregar' value="Recarregar"></input>   
                    </div> 
                </div>
            </div>
            <div className='row'>
                <table className='tabela' id="table">
                    <thead className='thead-dark'>
                        <tr>
                            <th>Cliente</th>
                            <th>Data da Venda</th>
                            <th>Funcionário</th>
                            <th>Conta</th>
                            <th>Items</th>
                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                <th>&nbsp;</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {vendas !== [] &&
                            vendas.map(venda =>(
                                <tr key={venda.id}>
                                    <td id="bold" scope='row' onClick={e=>selVenda(venda)}>{venda.nomeCliente}</td>
                                    <td onClick={e=>selVenda(venda)}>{moment.utc(venda.dataVenda).format('DD-MM-YYYY')}</td>
                                    <td onClick={e=>selVenda(venda)}>{venda.nomeUsuario}</td>
                                    
                                    <td>
                                        <a className="see">
                                            <span aria-hidden="true">Ver</span>
                                        </a>
                                    </td>

                                    <td>
                                        <a className="see">
                                            <span aria-hidden="true">Ver</span>
                                        </a>
                                    </td>
                                    
                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                        <td>
                                            <a className="close">
                                                <span id='tabela-excluir' aria-hidden="true">x</span>
                                            </a>
                                        </td>
                                    }
                                </tr>
                            )) 
                        }
                    </tbody>
                </table>
            </div>  
        </div>
        </>
    )
}

export default Vendas;