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
                <h1>Devolver Condicional</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>
                <div className="formulario">
                <div className='titulo'>
                    <h1>Informações da venda</h1>
                </div>

                <div className="formulario-padrao">
                    <label>Data da Venda</label>
                    <input type="text" placeholder="dd/mm/yyyy" required />
                </div>

                <div className="formulario-padrao">
                    <label>Data Limite</label>
                    <input type="value" placeholder="dd/mm/yyyy"/>
                </div>

                <div className="formulario-padrao">
                    <label>Observação</label>
                    <input type="value" placeholder="Digite a observação"/>
                </div>

                <div className="formulario-padrao">
                    <label>Valor Total</label>
                    <input type="email" name="email" id="email" placeholder="Digite o valor total"/>
                </div>
            </div>

                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Selecionar Venda Condicional</h1>
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
                                            <th>Cliente</th>
                                            <th>Data Venda</th>
                                            <th>Observação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>Yuri Junior Saito</td>
                                            <td>12/12/2012</td>
                                            <td>Sem obervação</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
            
            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Produtos Devolvidos</h1>
                        </div>
                        <div className='formulario-padrao-tabela-fornecedores'>

                            <div className='div-tabela-fornecedor'>
                                <table className='tabela-fornecedor'>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Quantidade</th>
                                            <th>Valor Total(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>Produto 1</td>
                                            <td>5</td>
                                            <td>110.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto 2</td>
                                            <td>2</td>
                                            <td>100.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto 3</td>
                                            <td>3</td>
                                            <td>50.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto 4</td>
                                            <td>6</td>
                                            <td>200.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="formulario-padrao">
                                <label>Valor Total</label>
                                <input type="email" name="email" id="email" placeholder="Valor Total"/>
                            </div>
                        </div>
                    </div>            
                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Produtos Condicional</h1>
                            <p>Selecione os produtos que deseja devolver</p>
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
                                            <th>Quantidade</th>
                                            <th>Valor Unitário(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                         <tr>
                                            <td>Produto</td>
                                            <td>4</td>
                                            <td>40.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p style={{color: "white"}}>Os produtos remanescentes irão para a venda</p>
                        </div>
                    </div>            
                </div>
            </div>
            <div className='formulario'>
                <div className='div-botoes'>
                    <button type="button">Limpar</button>
                    <button> 
                        Ir para Venda
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Formulario;