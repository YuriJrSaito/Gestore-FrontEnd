import './RealizarVenda.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';

function Formulario() {
    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>Contas a Receber</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Selecionar Conta</h1>
                        </div>
                        <div className='formulario-padrao-tabela-fornecedores'>
                            <div className='inputs-buscar-fornecedores'>
                                <input type="search" placeholder='Pesquisar por Cliente'></input>
                                <button>OK</button>   
                            </div> 

                            <div className='div-tabela-fornecedor'>
                                <table className='tabela-fornecedor'>
                                    <thead>
                                        <tr>
                                            <th>Nome Cliente</th>
                                            <th>Data Vencimento</th>
                                            <th>Valor Total(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Cliente</td>
                                            <td>05/06/2022</td>
                                            <td>1500</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='div-tabela-fornecedor'>
                                <label>Parcelas</label>
                                <table className='tabela-fornecedor'>
                                    <thead>
                                        <tr>
                                            <th>Número da parcela</th>
                                            <th>Data Vencimento</th>
                                            <th>Valor(R$)</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>1</td>
                                            <td>05/06/2022</td>
                                            <td>500</td>
                                            <button>Quitar</button>
                                        </tr>
                                         <tr>
                                            <td>2</td>
                                            <td>05/07/2022</td>
                                            <td>500</td>
                                            <button>Quitar</button>
                                        </tr>
                                         <tr>
                                            <td>3</td>
                                            <td>05/08/2022</td>
                                            <td>500</td>
                                            <button>Quitar</button>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
            <div className='formulario'>
                <div className='div-botoes'>
                    <button type="button">Limpar</button>
                    <button> 
                        Salvar
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Formulario;