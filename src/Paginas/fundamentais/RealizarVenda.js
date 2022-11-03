import './RealizarVenda.css';
import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faLessThanEqual} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import Validar from '../../servicos/validar';
import * as BsIcons from 'react-icons/bs';

import TabelaVenda from './Vendas.js';

function Formulario() {

    const [produtos, setProdutos] = useState([]);
    const [produtosSel, setProdutosSel] = useState([]);
    const [clientes, setClientes] = useState('');

    const [dataVenda, setDataVenda] = useState(moment().format('YYYY-MM-DD'));

    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [cpfCliente, setCpfCliente] = useState('');

    const [qtdeParcelas, setQtdeParcelas] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const [dataPrimeiroVencimento, setDataPrimeiroVencimento] = useState('');

    const [filtro, setFiltro] = useState('');
    const [filtroCliente, setFiltroCliente] = useState('');

    const [selecionado, setSelecionado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [button, setButton] = useState('Salvar');
    const [msg, setMsg] = useState('');

    const [formSelProdutos, setFormSelProdutos] = useState(false);
    const [formularioCadastro, setFormularioCadastro] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);
    const [defClienteSel, setDefClienteSel] = useState(false);

    async function limparAvisos()
    {
        if(formularioCadastro === true)
        {
            document.querySelector('#msgProdutos').innerHTML = "";
            document.querySelector('#msgSelCliente').innerHTML = "";
            document.querySelector('#msgDataVenda').innerHTML = "";
            document.querySelector('#msgVencimento').innerHTML = "";
            document.querySelector('#msgQtdeParcelas').innerHTML = "";
        }
    }

    async function limpar()
    {
        setSalvando(false);
        setSelecionado(false);
        setMsg("");
        setProdutosSel([]);
        setDataVenda(moment().format('YYYY-MM-DD'));
        setIdCliente("");
        setNomeCliente("");
        setQtdeParcelas("");
        setValorTotal(0);
        setDataPrimeiroVencimento("")
        setFiltro("");

        await limparAvisos();
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

    async function filtrarClientes()
    {
        var input, filter, table, tr, td, i, txtValue;

        input = document.getElementById("filtro-clientes");
        filter = input.value.toUpperCase();

        table = document.getElementById("table-clientes");
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

    async function proximoFormulario()
    {
        let resp = await validarSelProdutos();
        if(resp === true)
        {
            setFormSelProdutos(false);
            setFormularioCadastro(true);
        }
    }

    async function validarSelProdutos()
    {
        var val = new Validar();

        if(await val.validarProdutosSel(produtosSel))
        {
            return true;
        }
        else
        {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return false;
        }
    }

    async function validar()
    {
        var val = new Validar();

        if(await val.validarClienteSelecionado(idCliente) &&
           await val.validarDataEmissaoObrigatorio(dataVenda) &&
           await val.validarDataVencimento(dataPrimeiroVencimento, dataVenda) &&
           await val.validarQuantidadeObrigatorio(qtdeParcelas, "#msgQtdeParcelas", 12, "<p>Digite a quantidade</p>", "<p>Quantidade deve ser maior ou  igual a 0 (zero)</p>", "<p>Digite apenas Números</p>", "<p>Quantidade deve ser menor que 12</p>") 
        )
        {
            return true;
        }
        else
        {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return false;
        }
    }

    async function gravarContaReceber()
    {
        try{
            let resp = await api.post('/cadContaReceber',{
                qtdeParcelas: qtdeParcelas,
                valorTotal: valorTotal,
                dataEmissao: dataVenda,
                dataPrimeiroVencimento: dataPrimeiroVencimento,
            }).then(
                response => {
                    return response.data[0];
                }
            )
            return resp;
        }
        catch(err){
            console.log(err); 
        }
    }

    async function gravarVenda(idCR)
    {
        try{
            let resp = await api.post('/cadVenda',{
                dataVenda: dataVenda,
                idContaReceber: idCR,
                idAcesso: localStorage.getItem('acessoid'),
                idCliente: idCliente,
            }).then(
                response => {
                    return response.data[0];
                }
            )
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function gravarItemVenda(idVenda)
    {
        try{
            await api.post('/cadItemVenda',{
                produtos: produtosSel,
                idVenda: idVenda
            }).then(
                response => {
                    setMsg(response.data);
                }
            )
        }
        catch(err){
            console.log(err);
        }
    }

    async function confirmarDados()
    {
        if(await validar())
        {
            if(button === "Salvar")
            {
                let idCR = await gravarContaReceber();
                let idVenda = await gravarVenda(idCR);
                await gravarItemVenda(idVenda);
            }
        }
    }

    async function buscarClientes()
    {   
        try{
            await api.get('/listarTodosClientes')
            .then((response)=>{
                setClientes(response.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function definirClientes()
    {
        document.querySelector('#msgSelCliente').innerHTML = "";
        setDefClienteSel(true);
        await buscarClientes();
    }

    async function setarCliente(cliente)
    {
        setCpfCliente(cliente.cpf);
        setIdCliente(cliente.id);
        setNomeCliente(cliente.nome);
        setDefClienteSel(false);
    }

    async function carregarTodosProdutos()
    {
        try{
            await api.get('/listarTodosProdutos')
            .then((response)=>{
                setProdutos(response.data);
            })
        }catch(err){
            console.log(err);
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
            titulo: produto.titulo,
            codigoReferencia: produto.codigoReferencia,
            qtdeEstoque: produto.qtdeEstoque,
            qtdeSelecionado: 1,
            valorUnitario: produto.valorUnitario,
            img1: produto.img1,
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
        document.querySelector("#msgProdutos").innerHTML = "";
        if(produto.qtdeEstoque > 0)
        {
            var valor;
            produto.qtdeEstoque -= 1;
            if(selecionado === false)
                setSelecionado(true);
            if(await produtoExiste(prod) === false)
            {
                setProdutosSel([...produtosSel, prod]);
                valor = parseFloat(valorTotal) + parseFloat(prod.valorUnitario);
            }
            else
            {
                valor = valorTotal;
                for(var x=0; x<produtosSel.length; x++)
                {
                    if(prod.id === produtosSel[x].id)
                    {
                        var a  = parseInt(produtosSel[x].qtdeSelecionado);
                        a += 1;
                        produtosSel[x].qtdeSelecionado = a;
                        valor = parseFloat(valor) + parseFloat(prod.valorUnitario);
                    }
                }
            }
            valor = valor.toFixed(2);
            setValorTotal(parseFloat(valor));
        }
    }

    async function buscarQuantidadeProdutoSelecionado(idProd)
    {
        for(var x=0; x<produtosSel.length; x++)
        {
            if(produtosSel[x].id === idProd)
            {
                return produtosSel[x].qtdeEstoque;
            }
        }
    }

    async function alterarEstoqueProdutos(idProd, quant, devolver)
    {
        produtos.forEach(produto => {
            if(produto.id === idProd)
            {
                if(devolver === true)
                {
                    produto.qtdeEstoque += quant;
                }
                else
                {
                    produto.qtdeEstoque -= quant;
                }
            }
        });
    }

    async function verificarEstoqueSuficiente(idProd, quant, qtdeSelecionado)
    {
        for (let x=0; x<produtos.length; x++) 
        {
            if(produtos[x].id === idProd)
            {
                if((parseInt(produtos[x].qtdeEstoque) + parseInt(qtdeSelecionado)) < quant)
                {
                    //document.querySelector('#msgProdutosSel').innerHTML = `<p>${produtos[x].titulo}: Quantidade no estoque não é suficiente</p>`;
                    return false;
                }
            }
        }
        return true;
    }

    async function mudarEstoque(prod, quant)
    {
        if(prod.qtdeSelecionado > quant)
        {
            await alterarEstoqueProdutos(prod.id, parseInt(prod.qtdeSelecionado - quant), true);
        }
        else
        {
            await alterarEstoqueProdutos(prod.id, parseInt(quant - prod.qtdeSelecionado), false);
        }
    }

    async function definirProdutoQuantidade(prod, quant)
    {
        //document.querySelector('#msgProdutosSel').innerHTML = '';
        if(quant === '' || quant < 0)
            quant = 0;
        
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

        if(await verificarEstoqueSuficiente(prod.id, quant, prod.qtdeSelecionado) === false)
            quant = await buscarQuantidadeProdutoSelecionado(prod.id);
        else
        {
            await mudarEstoque(prod, quant);
           
            var valorFinal = 0;
            var valorVet = produtosSel.map(produto => {
                var val=0;

                if(produto.id === prod.id)
                {
                    produto.qtdeSelecionado = quant;
                }

                val += (parseFloat(produto.valorUnitario) * parseFloat(produto.qtdeSelecionado));
                return val;
            })
            for(var x=0; x<valorVet.length; x++)
            {
                valorFinal += valorVet[x];
            }
            valorFinal = valorFinal.toFixed(2);
            setValorTotal(parseFloat(valorFinal));
        }
    }

    const childToParent = (childdata) => {
        setFormSelProdutos(childdata);
        setTabela(!childdata);
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            {tabela === true &&
                <TabelaVenda childToParent={childToParent}/>
            }

            {formSelProdutos === true &&
            <>
                <div className='formulario-tabela'>
                    <div className='titulo'>
                        <div className='titulo-cont'>
                            <button id="retornar" onClick={e=>{setTabela(true);setFormSelProdutos(false)}}><BsIcons.BsArrowLeft/></button>
                            <h1>Informações</h1>
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
                                            <th>Quantidade Estoque</th>
                                            <th>Valor Unitario(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtos !== "" &&
                                            produtos.map(produto =>(
                                                <tr key={produto.id}>
                                                    <td onClick={e=>selProduto(produto)}>{produto.titulo}</td>
                                                    {produto.img1 === "" && <td onClick={e=>selProduto(produto)}>Sem imagens</td>}
                                                    {produto.img1 !== "" && <td onClick={e=>selProduto(produto)} id="imgTabela"><img id='imgTable' src={`/img//${produto.img1}`} alt="Aqui fica a primeira imagem"></img></td>}
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
                    <div className='msg' id='msgProdutos'></div>
                    </div>   
                </div>

                {selecionado === true &&
                <div className="formulario-tabela">
                    <div className='titulo-cadastro'>
                        <div className='titulo'>
                            <h1>Produtos Selecionados</h1>
                        </div>
                    </div>
                    <div className='formulario-padrao-tabela'>
                        <div className='row-tabela'>
                            <div className='div-tabela'>
                                <table className='tabela'>
                                    <thead>
                                        <tr className='thead-dark'>
                                            <th>Título</th>
                                            <th>Imagens</th>
                                            <th>Código</th>
                                            <th>Valor Unitario(R$)</th>
                                            <th>Quantidade</th>
                                            <th>Soma(R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtosSel !== "" &&
                                            produtosSel.map(produto =>(
                                                <tr key={produto.id}>
                                                    <td onClick={e=>selProduto(produto)}>{produto.titulo}</td> 
                                                    {produto.img1 === "" && <td onClick={e=>selProduto(produto)}>Sem imagens</td>}
                                                    {produto.img1 !== "" && <td onClick={e=>selProduto(produto)} id="imgTabela"><img id='imgTable' src={`/img//${produto.img1}`} alt="Aqui fica a primeira imagem"></img></td>}  
                                                    <td onClick={e=>selProduto(produto)}>{produto.codigoReferencia}</td>                                           
                                                    <td onClick={e=>selProduto(produto)}>R${produto.valorUnitario}</td>                                                 
                                                    <td><input type="number" value={produto.qtdeSelecionado} onChange={e=>{definirProdutoQuantidade(produto, e.target.value)}}/></td>
                                                    <td onClick={e=>selProduto(produto)}>R${(produto.valorUnitario * produto.qtdeSelecionado).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        }
                                        <tr>
                                            <td id='bold'>Valor Total(R$)</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td id='bold'>R${valorTotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='msg' id='msgProdutosSel'></div>
                            </div>
                        </div>
                    </div>  
                </div>  
                }   
                <div className='formulario'>
                    <div className='div-botoes'>
                        <button id="btnForm" onClick={proximoFormulario}>Proximo</button>
                    </div>
                </div>
                </>
            }

            {formularioCadastro === true &&
            <>
            <div className="formulario">
                <div className='titulo'>
                    <div className='titulo-cont'>
                        <button id="retornar" onClick={e=>{setFormSelProdutos(true);setFormularioCadastro(false)}}><BsIcons.BsArrowLeft/></button>
                        <h1>Informações sobre a venda</h1>
                    </div>
                </div>

                <div className="formulario-padrao" id="clienteSel">
                    <label>Selecionar Cliente*</label>
                    
                    <button className='clienteSelButton' onClick={e=>definirClientes()}>Buscar</button>

                    {nomeCliente !== "" &&
                        <>
                            <div className='cliente-area'>
                                <label>Cliente Selecionado</label>
                                <h1>Nome: {nomeCliente}</h1>
                                {cpfCliente !== '' &&
                                    <h1>CPF: {cpfCliente}</h1>
                                }
                                {cpfCliente === '' &&
                                    <h1>CPF: Este Cliente não possui CPF cadastrado</h1>
                                }
                            </div>
                        </>
                    }
                    <div className="msg" id='msgSelCliente'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Valor Total</label>
                    <input type="text" name="valorTotal" id="valorTotal" placeholder="Valor Total" value={valorTotal} disabled/>
                </div>

                <div className="formulario-padrao">
                    <label>Data da Venda*</label>
                    <input type="date" value={dataVenda} onChange={e=>{setDataVenda(e.target.value);document.querySelector("#msgDataVenda").innerHTML = ""}} placeholder="dd/mm/yyyy" required />
                    <div className='msg' id='msgDataVenda'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Vencimento da primeira parcela*</label>
                    <input type="date" value={dataPrimeiroVencimento} onChange={e=>{setDataPrimeiroVencimento(e.target.value);document.querySelector("#msgVencimento").innerHTML = ""}} placeholder="dd/mm/yyyy"/>
                    <div className='msg' id='msgVencimento'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Quantidade de parcelas*</label>
                    <input type="value" value={qtdeParcelas} onChange={e=>{setQtdeParcelas(e.target.value);document.querySelector("#msgQtdeParcelas").innerHTML = ""}} placeholder="Digite a quantidade de parcelas"/>
                    <div className='msg' id='msgQtdeParcelas'></div>
                </div>
                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>
            <div className='formulario'>
                <div className='div-botoes'>
                    <button type="button" onClick={limpar}>Limpar</button>
                    <button className={(salvando ? "disabled": "")} 
                        type="submit" id="btnForm" onClick={confirmarDados}>
                        {salvando === false && button}
                    </button>
                    {  salvando === true &&
                        
                        <button className='salvando' type="button">
                        {
                            salvando === true && <FontAwesomeIcon icon={faCircleNotch} className="fa-spin"/>
                        }
                        </button>
                    }
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

            {defClienteSel === true &&
            <div id="id01" className="modal-cliente">
                <form className="modal-content-cliente">
                    <div className="container-cliente"> 
                        <h1>Selecionar Cliente</h1>
                        <input className='inputs-buscar-cliente' type="search" id='filtro-clientes' placeholder='Pesquisar por Nome' value={filtroCliente} onChange={e=>{setFiltroCliente(e.target.value);filtrarClientes()}}></input>
                        
                        <div className='clearfix-clientes'>
                            <div className='row'>
                                <div className='div-tabela'>
                                    <table id='table-clientes'>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>CPF</th>
                                                <th>Idade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientes !== "" && 
                                                clientes.map(cliente => (
                                                    <tr key={cliente.id}>
                                                        <td onClick={e=> setarCliente(cliente)}>{cliente.nome}</td>
                                                        <td onClick={e=> setarCliente(cliente)}>{cliente.cpf}</td>
                                                        <td onClick={e=> setarCliente(cliente)}>{cliente.idade}</td>
                                                    </tr> 
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => setDefClienteSel(false)}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
            }
        </div>
        </>
    )
}

export default Formulario;