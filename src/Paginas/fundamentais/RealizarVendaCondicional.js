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
                <h1>Realizar Venda Condicional</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario">

                        <div className='titulo'>
                            <h1>Informações Cliente</h1>
                        </div>

                        <div className="formulario-padrao">
                            <label>Nome do Cliente</label>
                            <input type="text" name="nome" id="nome" placeholder="Nome" required />
                        </div>

                        <div className="formulario-padrao">
                            <label>CPF</label>
                            <input type="value" name="cpf" id="cpf" placeholder="xxx.xxx.xxx-xx"/>
                        </div>

                        <div className="formulario-padrao">
                            <label>Email</label>
                            <input type="email" name="email" id="email" placeholder="exemplo@email.com"/>
                        </div>
                    </div>

                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Selecionar o Cliente</h1>
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
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            <th>Telefone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         <tr>
                                            <td>Yuri Junior Saito</td>
                                            <td>52799249892</td>
                                            <td>(14)99722-9859</td>
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
                            <h1>Produtos Selecionados</h1>
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
                        </div>
                    </div>            
                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Selecionar Podutos</h1>
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
                        </div>
                    </div>            
                </div>
            </div>
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