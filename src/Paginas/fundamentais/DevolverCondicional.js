import './RealizarVenda.css';
import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import * as BsIcons from 'react-icons/bs';
import {Navigate, useNavigate} from 'react-router-dom';

function Formulario() {
    const [tabela, setTabela] = useState(true);
    const [formSelProdutos, setFormSelProdutos] = useState(false);
    const [vendas, setVendas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtosDevolvidos, setProdutosDevolvidos] = useState([]);
    const [teste, setTeste] = useState(false);
    const [valorTotal, setValorTotal] = useState(0);
    const [filtro, setFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState(0);
    const [msg, setMsg] = useState('');
    const [defExclusao, setDefExclusao] = useState(false);
    const [defProxVenda, setDefProdVenda] = useState(false);
    const [idVenda, setIdVenda] = useState('');

    const [excProd, setExcProd] = useState('');

    const Navigate = useNavigate();

    async function buscarItems(idVenda)
    {
        try{
            const resp = await api.get(`/buscarProdutosCond/${idVenda}`)
            .then((response)=>{
                return response.data;
            })
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function buscarProdutos(items)
    {   
        try{
            let resp = await api.post(`/buscarInfoProdutos`,{
                items: items,
            })
            .then(
                response => {
                    setProdutos(response.data);
                    return response.data;
                }
            )
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function selVenda(venda)
    {
        setIdVenda(venda.id);
        setTabela(false);
        await setFormSelProdutos(true);
        let items = await buscarItems(venda.id);
        let retorno = await buscarProdutos(items);
        let total = 0;
        for(let prod of retorno)
        {
            let valor = parseFloat(prod.valorUnitario) * parseInt(prod.qtdeSelecionado);
            total = parseFloat((total+valor).toFixed(2));
        }
        setValorTotal(total);
    }   

    async function filtrarClientes()
    {
        var input, filter, table, tr, td, i, txtValue;

        input = document.getElementById("filtro");
        filter = input.value.toUpperCase();

        table = document.getElementById("tabelaVendas");
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

    async function filtrarProdutos()
    {
        var input, filter, table, tr, td, i, txtValue;

        input = document.getElementById("filtro-produtos");
        filter = input.value.toUpperCase();

        table = document.getElementById("table-produtos");
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

    async function carregarVendas()
    {
        await api.get('/listarVendasCond')
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

    async function definirProdutoQuantidade(prod, e)
    {
        let oldQuantidade = parseInt(prod.qtdeSelecionado);
        let quant = 0;
        setTeste(!teste);
        if(e.target.value === "" || e.target.value < 0)
            quant = 0;
        else
            quant = e.target.value;

        if(quant >= 0 && quant <= prod.qtdeNoItem)
        {
            if(quant > 0)
            {
                var separar = quant.split('');
                if(separar[0] === "0")
                {
                    var a = "";
                    for(let x=1; x<separar.length; x++)
                    {
                        a += separar[x];
                    }
                    quant = parseInt(a);
                }
            }
            prod.qtdeSelecionado = parseInt(quant);
            e.target.value = quant;
            let valor = parseFloat(prod.valorUnitario) * oldQuantidade;
            let total = valorTotal;
            total = parseFloat(total) - parseFloat(valor);
            total = parseFloat(total) + (parseFloat(prod.valorUnitario)*parseInt(prod.qtdeSelecionado));
            total = parseFloat(total.toFixed(2));
            setValorTotal(total);
        }
    }

    async function retirarProduto(produto)
    {
        setDefExclusao(true);
        setExcProd(produto);
    }

    async function cancelar()
    {
        setExcProd('');
        setDefExclusao(false);
    }

    async function excluirProdutoLista()
    {
        setProdutosDevolvidos([...produtosDevolvidos, excProd]);
        setProdutos(produtos.filter(produtos=>produtos.id !== excProd.id));

        let valor = parseFloat(excProd.valorUnitario) * parseInt(excProd.qtdeSelecionado);
        valor = parseFloat(valor.toFixed(2));
        setValorTotal(parseFloat((valorTotal - valor).toFixed(2)));
        await cancelar();
    }

    async function definirVenda()
    {
        setDefProdVenda(true);
    }

    async function cancelarProximo()
    {
        setExcProd('');
        setDefProdVenda(false);
    }

    async function devolverItems(prods)
    {
        try{
            let resp = await api.post(`/devolverProdutosCond`,{
                items: prods,
                idVenda: idVenda
            })
            .then(
                response => {
                    return response.data;
                }
            )
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function copiarProd(prod, quantidade)
    {
        let newProd = {
            id: prod.id,
            titulo: prod.titulo,
            valorUnitario: prod.valorUnitario,
            qtdeEstoque: prod.qtdeEstoque,
            img1: prod.img1,
            codigo: prod.codigo,
            qtdeNoItem: prod.qtdeNoItem,
            qtdeSelecionado: quantidade,
            valor: prod.valor,
            itemId: prod.itemId,
        }
        return newProd;
    }

    async function verificarItensRetirados()
    {
        let vetProdutos = [];
        for(let prod of produtos)
        {
            //defino a quantidade
            let quant = parseInt(prod.qtdeNoItem) - parseInt(prod.qtdeSelecionado);

            //se quantidade for maior que zero quer dizer que é necessario devolver items
            if(quant > 0)
            {
                let newProd = await copiarProd(prod, quant);
                vetProdutos = [...vetProdutos, newProd];
            }
        }

        for(let devolvido of produtosDevolvidos)
        {
            let newProd = await copiarProd(devolvido, devolvido.qtdeNoItem);
            vetProdutos = [...vetProdutos, newProd];
        }
        return vetProdutos;
    }

    async function proximoVenda()
    {
        localStorage.setItem("idVendaCondicional", idVenda);
        //let prods = await verificarItensRetirados();
        //await devolverItems(prods);
        return Navigate("/realizarVenda");
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='background'>
                {tabela === true &&
                <>
                <div className="formulario-tabela">
                    <div className='titulo-cadastro'>
                        <div className='titulo'>
                            <h1>Venda Condicional</h1>
                        </div>
                    </div>
                    
                    <div className='formulario-padrao-tabela'>
                        <div className='inputs-buscar'>
                            <select className='filtroSelect' value={tipoFiltro} onChange={e=>{setTipoFiltro(e.target.value)}}>
                                <option key={0} value={0}>Cliente</option>
                                <option key={1} value={1}>Funcionário</option>
                            </select>

                            <input type="search" id="filtro" value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarClientes()}} placeholder='Pesquisar'></input>
                            <input type="button" value="Recarregar"></input>   
                        </div> 
                    </div>
                </div>
                <div className='row'>
                    <table className='tabela' id="tabelaVendas">
                        <thead className='thead-dark'>
                            <tr>
                                <th>Cliente</th>
                                <th>Funcionário</th>
                                <th>Data Criação</th>
                                <th>Data Limite</th>
                                <th>Observação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas !== [] &&
                                vendas.map(venda =>(
                                    <tr key={venda.id}>
                                        <td id="bold" scope='row' onClick={e=>selVenda(venda)}>{venda.nomeCliente}</td>
                                        <td onClick={e=>selVenda(venda)}>{venda.nomeUsuario}</td>
                                        <td onClick={e=>selVenda(venda)}>{moment.utc(venda.dataCriacao).format('DD-MM-YYYY')}</td>
                                        <td onClick={e=>selVenda(venda)}>{moment.utc(venda.dataLimite).format('DD-MM-YYYY')}</td>
                                        <td onClick={e=>selVenda(venda)}>{venda.observacao}</td>
                                    </tr>
                                )) 
                            }
                        </tbody>
                    </table>
                </div>        
                </>   
                }

                {formSelProdutos === true &&
                <>
                <div className='background-venda'>
                    <div className='formulario-tabela'>
                        <div className='titulo'>
                            <div className='titulo-cont'>
                                <button id="retornar" onClick={e=>{setTabela(true);setFormSelProdutos(false)}}><BsIcons.BsArrowLeft/></button>
                                <h1>Produtos</h1>
                            </div>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='inputs-buscar'>
                                <input type="search" id='filtro-produtos' placeholder='Pesquisar por título' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarProdutos()}}></input>
                            </div> 
                            <div className='row-tabela'>
                                <div className='div-tabela'>
                                    <table className='tabela' id='table-produtos'>
                                        <thead>
                                            <tr className='thead-dark'>
                                                <th>Título</th>
                                                <th>Imagens</th>
                                                <th>Código</th>
                                                <th>Quantidade</th>
                                                <th>Selecionado</th>
                                                <th>Soma(R$)</th>
                                                <th>&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produtos !== "" &&
                                                produtos.map(produto =>(
                                                    <tr key={produto.id}>
                                                        <td>{produto.titulo}</td>
                                                        {produto.img1 === "" && <td>Sem imagens</td>}
                                                        {produto.img1 !== "" && <td id="imgTabela"><img id='imgTable' src={`/img//${produto.img1}`} alt="Aqui fica a primeira imagem"></img></td>}
                                                        <td>{produto.codigoReferencia}</td>
                                                        <td>{produto.qtdeNoItem}</td>
                                                        <td><input type="number" value={produto.qtdeSelecionado} onChange={e=>{definirProdutoQuantidade(produto, e)}}/></td>
                                                        <td>R${parseFloat(produto.valorUnitario) * parseInt(produto.qtdeSelecionado)}</td>
                                                        <td>
                                                            <a className="close">
                                                                <span aria-hidden="true" onClick={e=>retirarProduto(produto)}>x</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>
                                                <td>Valor Total</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>R${valorTotal}</td>
                                                <td>&nbsp;</td>
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
                        <button id="btnForm" onClick={definirVenda}>Ir para Venda</button>
                    </div>
                </div>
                </>
                }

                {msg !== "" &&
                    <div className='formulario'>
                        <p id='msgSistema'>Mensagem do Sistema</p>
                        <p id='msgSistema'>{msg}</p>
                    </div>
                }

                {defExclusao === true &&
                <div id="id02" className="modal">
                    <form className="modal-content">
                        <div className="container">
                            <h1>Retirar Produto</h1>
                            <p>Este produto será retirado desta venda e não será possivel recuperá-lo deseja continuar?</p>  

                            <div className='produto-sel'>                     
                                <p>Título: {excProd.titulo}</p>
                                <p>Imagem: </p>
                                {excProd.img1 === "" &&
                                    <p>Sem imagens</p>
                                }
                                {excProd.img1 !== "" &&
                                    <p><img id='img-produto-sel' src={`/img//${excProd.img1}`} alt="Primeira Imagem"></img></p>
                                }
                                
                                <p>Código Referência: {excProd.codigoReferencia}</p>
                                <p>Quantidade: {excProd.qtdeNoItem}</p>
                            </div>
       
                            <div className="clearfix">
                                <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                                <button type="button" className="deletebtn" onClick={()=>excluirProdutoLista()}>Deletar</button>
                            </div>
                            
                        </div>
                    </form>
                </div>
                }

                {defProxVenda === true &&
                <div id="id02" className="modal">
                    <form className="modal-content">
                        <div className="container">
                            <h1>Prosseguir para venda</h1>
                            <p>Ao clicar em continuar você será redirecionado(a) para a venda com todos os produtos presentes na tabela,
                               após isso não será possivel efetuar a retirada de produtos ou cancelar a compra.
                            </p>  
                            <p>Deseja continuar ?</p>

                            <div className="clearfix">
                                <button type="button" className="cancelbtn" onClick={()=>cancelarProximo()}>Cancelar</button>
                                <button type="button" className="deletebtn" onClick={()=>proximoVenda()}>Continuar</button>
                            </div>
                            
                        </div>
                    </form>
                </div>
                }
            </div>
        </div>
        </>
    )
}

export default Formulario;