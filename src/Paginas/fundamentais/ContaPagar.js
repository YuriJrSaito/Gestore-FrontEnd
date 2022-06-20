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
                <h1>Contas a Pagar</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario">

                        <div className='titulo'>
                            <h1>Valor Total</h1>
                        </div>

                        <div className="formulario-padrao">
                            <label>Quantidade Parcelas</label>
                            <input type="text" name="nome" id="nome" placeholder="quantidade parcelas" required />
                        </div>

                        <div className="formulario-padrao">
                            <label>Titulo</label>
                            <input type="value" name="cpf" id="cpf" placeholder="titulo"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Observação</label>
                            <input type="email" name="email" id="email" placeholder="observação"/>
                        </div>
                        
                        <div className="formulario-padrao">
                            <label>Data Emissão</label>
                            <input type="date" name="email" id="email" placeholder="Data Emissão"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Data Submissão</label>
                            <input type="date" name="email" id="email" placeholder="Data Submissão"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Tipo Documento</label>
                            <input type="text" name="email" id="email" placeholder="Tipo de documento"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Número Documento</label>
                            <input type="text" name="email" id="email" placeholder="Número do documento"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Selecione o Fornecedor</label>
                            <select>
                                <option>Fornecedor</option>
                            </select>
                        </div>
                    </div>

                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Selecionar Conta</h1>
                        </div>
                        <div className='formulario-padrao-tabela-fornecedores'>
                            <div className='inputs-buscar-fornecedores'>
                                <input type="search" placeholder='Pesquisar por Nome'></input>
                                <button>OK</button>   
                            </div> 

                            <div className='div-tabela-fornecedor'>
                                <table className='tabela-fornecedor'>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Data Vencimento</th>
                                            <th>Valor Total(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>Aluguel</td>
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