import './RealizarVenda.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faLessThanEqual} from '@fortawesome/free-solid-svg-icons';

function Formulario() {

    const [produtos, setProdutos] = useState([]);
    const [produtosSel, setProdutosSel] = useState([]);
    const [clientes, setClientes] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const [dataVenda, setDataVenda] = useState('');
    const [idContaReceber, setIdContaReceber] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [requisicao, setRequisicao] = useState(false);
    const [produtosAlterados, setProdutosAlterados] = useState([]);

    const [nomeCliente, setNomeCliente] = useState('');

    async function buscarClientes()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get('/listarTodosClientes')
            .then((response)=>{
                setClientes(response.data);
            });
            setRequisicao(false);
        }
    }

    async function definirClientes()
    {
        document.getElementById('id01').style.display ='block';
        await buscarClientes();
    }

    async function carregarTodosProdutos()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get('/listarTodosProdutos')
            .then((response)=>{
                setProdutos(response.data);
            });
            setRequisicao(false);
        }
    }

    async function carregarTudo()
    {
        await carregarTodosProdutos();
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function copiarProd(produto)
    {
        var prod = {
            id: produto.id,
            codigoReferencia: produto.codigoReferencia,
            qtdeEstoque: 1,
            titulo: produto.titulo,
            descricao: produto.descricao,
            valorUnitario: produto.valorUnitario,
            valorDeCompra: produto.valorDeCompra,
            id_categoria: produto.id_categoria,
            id_fornecedor: produto.id_fornecedor,
            img1: produto.img1,
            img2: produto.img2,
            img3: produto.img3,
        }
        return prod;
    }

    async function produtoExiste(prod)
    {
        var existe = false;
        if(produtosSel !== '')
        {
            for(var x=0; x<produtosSel.length; x++)
            {
                if(produtosSel[x].id === prod.id)
                    existe = true;
            }
        }
        return existe;
    }

    async function selProduto(produto)
    {
        var prod = await copiarProd(produto);

        if(produto.qtdeEstoque > 0)
        {
            var valor;
            produto.qtdeEstoque -= 1;
            if(await produtoExiste(prod) === false)
            {
                setProdutosSel([...produtosSel, prod]);
                valor = parseFloat(valorTotal) + parseFloat(prod.valorUnitario);
                valor = valor.toFixed(2);
                setValorTotal(parseFloat(valor));
            }
            else
            {
                valor = valorTotal;
                for(var x=0; x<produtosSel.length; x++)
                {
                    if(prod.id === produtosSel[x].id)
                    {
                        produtosSel[x].qtdeEstoque += 1;
                        valor = parseFloat(valor) + parseFloat(prod.valorUnitario);
                    }
                }
                valor = valor.toFixed(2);
                setValorTotal(parseFloat(valor));
            }
        }
    }

    async function alterarEstoqueProdutos(idProd, quant, devolver)
    {
        produtos.map(produto =>{
            if(produto.id === idProd)
            {
                if(devolver === true)
                {
                    produto.qtdeEstoque += quant;
                }
                else
                {
                    //verificar quantidade menor
                    produto.qtdeEstoque -= quant;
                }
            }
        })
    }

    async function verificarEstoque(prod, quant)
    {
        if(prod.qtdeEstoque > quant)
        {
            await alterarEstoqueProdutos(prod.id, parseInt(prod.qtdeEstoque - quant), true);
        }
        else
        {
            await alterarEstoqueProdutos(prod.id, parseInt(quant - prod.qtdeEstoque), false);
        }
    }

    async function definirProdutoQuantidade(prod, quant)
    {
        if(quant === '')
            quant = 0;

        await verificarEstoque(prod, quant);
        
        var valorVet;
        var valorFinal = 0;
        valorVet = produtosSel.map(produto => {
            var val=0;

            if(produto.id === prod.id)
            {
                produto.qtdeEstoque = quant;
            }

            val += (parseFloat(produto.valorUnitario) * parseFloat(produto.qtdeEstoque));
            return val;
        })
        for(var x=0; x<valorVet.length; x++)
        {
            valorFinal += valorVet[x];
        }
        var valorFinal = valorFinal.toFixed(2);
        setValorTotal(parseFloat(valorFinal));
        
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>Realizar Venda</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>           
                    <div className="formulario-tabela">
                        <div className='titulo'>
                            <h1>Selecionar Podutos</h1>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='inputs-buscar-fornecedores'>
                                <input type="search" placeholder='Pesquisar'></input>
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
                                        {produtos !== "" &&
                                            produtos.map(produto =>(
                                                <tr key={produto.id} id="alterando">
                                                    <td onClick={e=>selProduto(produto)}>{produto.titulo}</td>
                                                    <td onClick={e=>selProduto(produto)}>{produto.codigoReferencia}</td>
                                                    <td onClick={e=>selProduto(produto)}>{produto.qtdeEstoque}</td>
                                                    <td onClick={e=>selProduto(produto)}>R${produto.valorUnitario}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>     
                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Produtos Selecionados</h1>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='div-tabela'>
                                <table className='tabela'>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Código</th>
                                            <th>Valor Unitario(R$)</th>
                                            <th>Quantidade</th>
                                            <th>Valor Total(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtosSel !== "" &&
                                            produtosSel.map(produto =>(
                                                <tr key={produto.id} id="alterando">
                                                    <td onClick={e=>selProduto(produto)}>{produto.titulo}</td>   
                                                    <td onClick={e=>selProduto(produto)}>{produto.codigoReferencia}</td>                                           
                                                    <td onClick={e=>selProduto(produto)}>R${produto.valorUnitario}</td>                                                 
                                                    <td><input type="number" value={produto.qtdeEstoque} onChange={e=>{definirProdutoQuantidade(produto, e.target.value)}}/></td>
                                                    <td onClick={e=>selProduto(produto)}>R${(produto.valorUnitario * produto.qtdeEstoque).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        }
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

                <div className="formulario-padrao" id="clienteSel">
                    <label>Selecionar Cliente</label>
                    <button onClick={e=>definirClientes()}>Selecionar cliente</button>
                    {
                        idCliente !== "" &&
                        <>
                            <label>Cliente Selecionado</label>
                            <p>Nome: {nomeCliente}</p>
                            <p>Id: {idCliente}</p>
                        </>
                    }
                </div>

                <div className="formulario-padrao">
                    <label>Valor Total</label>
                    <input type="text" name="valorTotal" id="valorTotal" placeholder="Valor Total" value={valorTotal} disabled/>
                </div>

                <div className="formulario-padrao">
                    <label>Data da Venda</label>
                    <input type="date" placeholder="dd/mm/yyyy" required />
                </div>

                <div className="formulario-padrao">
                    <label>Quantidade de parcelas</label>
                    <input type="value" placeholder="Digite a quantidade parcelas"/>
                </div>

                <div className="formulario-padrao">
                    <label>Descrição</label>
                    <input type="value" placeholder="Digite a descrição"/>
                </div>

                <div className="formulario-padrao">
                    <label>Forma de pagamento</label>
                    <input type="email" name="email" id="email" placeholder="Digite a forma de pagamento"/>
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

            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Selecionar Cliente</h1>

                        <div className='clearfix'>
                            <div className='div-tabela'>
                                <table className='tabela'>
                                    <thead>
                                        <tr>
                                            <td>Nome</td>
                                            <td>CPF</td>
                                            <td>Idade</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes !== "" && 
                                            clientes.map(cliente => (
                                                <tr key={cliente.id}>
                                                    <td onClick={e=> {setIdCliente(cliente.id);setNomeCliente(cliente.nome);document.getElementById('id01').style.display='none'}}>{cliente.nome}</td>
                                                    <td onClick={e=> {setIdCliente(cliente.id);setNomeCliente(cliente.nome);document.getElementById('id01').style.display='none'}}>{cliente.cpf}</td>
                                                    <td onClick={e=> {setIdCliente(cliente.id);setNomeCliente(cliente.nome);document.getElementById('id01').style.display='none'}}>{cliente.idade}</td>
                                                </tr> 
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => document.getElementById('id01').style.display='none'}>Cancelar</button>
                        </div>
            
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;