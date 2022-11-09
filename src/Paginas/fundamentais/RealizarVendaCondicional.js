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

function Formulario() {

    const [vendas, setVendas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtosSel, setProdutosSel] = useState([]);
    const [produtosEx, setProdutosEx] = useState([]);
    const [clientes, setClientes] = useState('');

    const [idVenda, setIdVenda] = useState(''); 
    const [dataCriacao, setDataCriacao] = useState(moment().format('YYYY-MM-DD'));
    const [dataLimite, setDataLimite] = useState('');
    const [observacao, setObservacao] = useState('');

    const [idCliente, setIdCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [cpfCliente, setCpfCliente] = useState('');

    const [valorTotal, setValorTotal] = useState(0);

    const [filtro, setFiltro] = useState('');
    const [filtroCliente, setFiltroCliente] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState(0);

    const [selecionado, setSelecionado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [button, setButton] = useState('Salvar');
    const [msg, setMsg] = useState('');

    const [formSelProdutos, setFormSelProdutos] = useState(false);
    const [formularioCadastro, setFormularioCadastro] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);
    const [defClienteSel, setDefClienteSel] = useState(false);
    const [alterarCliente, setAlterarCliente] = useState(true);
    const [msgAlterarCliente, setMsgAlterarCliente] = useState('');

    const [excVenda, setExcVenda] = useState('');

    //todo:
    //terminar o alterar no backend
    //fazer o devolver produtos

    async function limparAvisos()
    {
        if(formularioCadastro === true)
        {
            document.querySelector('#msgSelCliente').innerHTML = "";
            document.querySelector('#msgCriacao').innerHTML = "";
            document.querySelector('#msgLimite').innerHTML = "";
        }
        if(formSelProdutos === true)
        {
            document.querySelector('#msgProdutos').innerHTML = "";
        }
    }

    async function limpar()
    {
        setSalvando(false);
        setSelecionado(false);
        setAlterarCliente(true);
        setMsgAlterarCliente('');
        setMsg("");
        setProdutosSel([]);
        setProdutosEx([]);
        setDataCriacao(moment().format('YYYY-MM-DD'));
        setIdCliente("");
        setNomeCliente("");
        setValorTotal(0);
        setDataLimite("")
        setFiltro("");
        setObservacao("");

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

    async function carregarVendas()
    {
        await api.get('/listarVendasCond')
        .then((response)=>{
            setVendas(response.data);
        });
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
           await val.validarDataCriacao(dataCriacao) &&
           await val.validarDataLimite(dataLimite, dataCriacao) &&
           await val.validarObservacaoOpcional(observacao, document.querySelector("#msgObservacao"), "<p>Observação deve ter no máximo 30 caracteres</p>")
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

    async function gravarVenda()
    {
        try{
            let resp = await api.post('/cadVendaCond',{
                dataCriacao: dataCriacao,
                dataLimite: dataLimite,
                observacao: observacao,
                valorTotal: valorTotal,
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

    async function gravarLista(idVenda)
    {
        try{
            await api.post('/cadListaCond',{
                produtos: produtosSel,
                idVenda: idVenda,
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

    async function alterarVenda()
    {
        try{
            await api.put('/alterarVendaCond',{
                idVenda: idVenda,
                dataCriacao: dataCriacao,
                dataLimite: dataLimite,
                observacao: observacao,
                valorTotal: valorTotal,
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

    async function alterarLista()
    {
        try{
            await api.put('/alterarListaCond',{
                produtos: produtosSel,
                idVenda: idVenda,
                produtosEx: produtosEx,
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
                let idVenda = await gravarVenda();
                await gravarLista(idVenda);
            }
            else
            {
                await alterarVenda();
                await alterarLista();
            }
            setFormularioCadastro(false);
            setTabela(true);
            await limpar();
            await carregarVendas();
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
        await carregarVendas();
        await carregarTodosProdutos();
    }

    async function selVenda(venda)
    {
        await carregarTodosProdutos();
        setObservacao(venda.observacao);
        setDataCriacao(venda.dataCriacao);
        setDataLimite(venda.dataLimite);
        
        setIdVenda(venda.id);
        setValorTotal(venda.valorTotal);
        setCpfCliente(venda.cpfCliente);
        setNomeCliente(venda.nomeCliente);
        setIdCliente(venda.idCliente);
        setAlterarCliente(false);   
        setMsgAlterarCliente("Não é possivel alterar o cliente");
        setButton("Alterar");

        let resp = await buscarProdutos(venda.id);
        await gerarListaSel(resp);
    }

    async function gerarListaSel(resp)
    {
        let vetorProdutos = [];
        for(let x=0; x<resp.length; x++)
        {
            let obProduto = await produtos.find(produtos=>produtos.id == resp[x].idProduto);
            let copia = await copiarProdSel(obProduto, false, resp[x].idLista, resp[x].quantidade);
            copia.qtdeSelecionado = resp[x].quantidade;
            vetorProdutos = [...vetorProdutos, copia];
        } 
        setProdutosSel(vetorProdutos);
        setSelecionado(true);     
        setTabela(false);
        setFormSelProdutos(true);
    }

    async function copiarProdSel(produto, novoItem, idLista, qtde)
    {
        var prod = {
            id: produto.id,
            titulo: produto.titulo,
            codigoReferencia: produto.codigoReferencia,
            qtdeEstoque: parseInt(produto.qtdeEstoque)+parseInt(qtde),
            qtdeSelecionado: 1,
            valorUnitario: produto.valorUnitario,
            img1: produto.img1,
            novoItem: novoItem,
            idLista: idLista,
        }
        return prod;
    }

    async function buscarProdutos(idVenda)
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
        let prod;
        if(button === "Alterar")
        {
            setProdutosEx(produtosEx.filter(produtosEx=>produtosEx.idProduto !== produto.id));
            prod = await copiarProdSel(produto, true, -1);
        }
        else
            prod = await copiarProd(produto);

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

    async function definirExclusao(idVenda)
    {
        setDefExclusao(true);
        setExcVenda(idVenda);
    }

    async function cancelar()
    {
        setDefExclusao(false);
        setExcVenda('');
    }

    async function excluirVenda()
    {
        let resp = await delLista(excVenda);
        if(resp === true)
        {
            await delVenda(excVenda);
            await carregarVendas();

            setDefExclusao(false);
        }
        else
            setMsg("Algo deu errado!!");
    }

    async function delVenda(idVenda)
    {
        if(idVenda !== "")
        {
            try{
                await api.delete(`/deletarVendaCond/${idVenda}`);
            }
            catch(err){
                console.log(err);
            }
            await limpar();
        } 
    }

    async function delLista(idVenda)
    {
        if(idVenda !== "")
        {
            try{
                const resp = await api.delete(`/deletarListaCond/${idVenda}`)
                .then((response)=>{
                    return response.data;
                })
                return resp;
            }
            catch(err){
                console.log(err);
            }
            await limpar();
        } 
    }

    async function retirarProduto(idProduto)
    {
        let res = produtosSel.find(produtosSel=>produtosSel.id == idProduto);
        let valor = parseFloat(valorTotal) - (parseFloat(res.valorUnitario) * res.qtdeSelecionado);
        setValorTotal(valor.toFixed(2));
        setProdutosSel(produtosSel.filter(produtosSel=>produtosSel.id !== idProduto));
        
        let res2 = produtos.find(produtos=>produtos.id == idProduto);

        if(res2.qtdeEstoque == 0)
            res2.qtdeEstoque = res.qtdeSelecionado;
        else
            if(res.qtdeSelecionado > 0)
                res2.qtdeEstoque = parseInt(res2.qtdeEstoque) + parseInt(res.qtdeSelecionado);
        
        let prod = {
            idProduto: idProduto,
            quantidade: res2.qtdeEstoque,
        }

        setProdutosEx([...produtosEx, prod]);
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
                    <input type="button" value="Realizar Venda" onClick={e=>{carregarTodosProdutos();setTabela(false);setFormSelProdutos(true)}}></input>
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
                                    <td onClick={e=>selVenda(venda)}>{venda.nomeUsuario}</td>
                                    <td onClick={e=>selVenda(venda)}>{moment.utc(venda.dataCriacao).format('DD-MM-YYYY')}</td>
                                    <td onClick={e=>selVenda(venda)}>{moment.utc(venda.dataLimite).format('DD-MM-YYYY')}</td>
                                    <td onClick={e=>selVenda(venda)}>{venda.observacao}</td>
                                    <td>
                                        <a className="see">
                                            <span aria-hidden="true">Ver</span>
                                        </a>
                                    </td>
                                    
                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                        <td>
                                            <a className="close">
                                                <span aria-hidden="true" onClick={e=>definirExclusao(venda.id)}>x</span>
                                            </a>
                                        </td>
                                    }
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
                            <button id="retornar" onClick={e=>{setSelecionado(false);setProdutosSel([]);setValorTotal(0);setTabela(true);setFormSelProdutos(false)}}><BsIcons.BsArrowLeft/></button>
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
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtosSel !== "" &&
                                            produtosSel.map(produto =>(
                                                <tr key={produto.id}>
                                                    <td>{produto.titulo}</td> 
                                                    {produto.img1 === "" && <td>Sem imagens</td>}
                                                    {produto.img1 !== "" && <td id="imgTabela"><img id='imgTable' src={`/img//${produto.img1}`} alt="Aqui fica a primeira imagem"></img></td>}  
                                                    <td>{produto.codigoReferencia}</td>                                           
                                                    <td>R${produto.valorUnitario}</td>                                                 
                                                    <td><input type="number" value={produto.qtdeSelecionado} onChange={e=>{definirProdutoQuantidade(produto, e.target.value)}}/></td>
                                                    <td>R${(produto.valorUnitario * produto.qtdeSelecionado).toFixed(2)}</td>
                                                    <td>
                                                        <a className="close-prodSel">
                                                            <span aria-hidden="true" onClick={e => {retirarProduto(produto.id, produto.idLista)}}>x</span>
                                                        </a>
                                                    </td>
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
                                            <td>&nbsp;</td>
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
            </div>
            </>
            }

            {formularioCadastro === true &&
            <>
            <div className='background'>
            <div className="formulario">
                <div className='titulo'>
                    <div className='titulo-cont'>
                        <button id="retornar" onClick={e=>{setFormSelProdutos(true);setFormularioCadastro(false)}}><BsIcons.BsArrowLeft/></button>
                        <h1>Informações sobre a venda</h1>
                    </div>
                </div>

                <div className="formulario-padrao" id="clienteSel">
                    <label>Selecionar Cliente*</label>
                    {msgAlterarCliente !== '' &&
                        <p style={{color:"red"}}>{msgAlterarCliente}</p>
                    }
                    
                    {alterarCliente === true &&
                        <button className='clienteSelButton' onClick={e=>definirClientes()}>Buscar</button>
                    }
                    {nomeCliente !== "" &&
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
                    }
                    <div className="msg" id='msgSelCliente'></div>
                </div>


                <div className="formulario-padrao">
                    <label>Valor Total</label>
                    <input type="text" name="valorTotal" id="valorTotal" placeholder="Valor Total" value={valorTotal} disabled/>
                </div>

                <div className="formulario-padrao">
                    <label>Data de criação</label>
                    <input type="date" value={dataCriacao} onChange={e=>{setDataCriacao(e.target.value);document.querySelector("#msgCriacao").innerHTML = ""}} placeholder="dd/mm/yyyy" required />
                    <div className='msg' id='msgCriacao'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Data Limite</label>
                    <input type="date" value={dataLimite} onChange={e=>{setDataLimite(e.target.value);document.querySelector("#msgLimite").innerHTML = ""}} placeholder="dd/mm/yyyy"/>
                    <div className='msg' id='msgLimite'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Observação</label>
                    <input type="value" value={observacao} onChange={e=>{setObservacao(e.target.value);document.querySelector("#msgObservacao").innerHTML = ""}} placeholder="Digite a observação"/>
                    <div className='msg' id='msgObservacao'></div>
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

            {defExclusao === true &&
            <div id="id02" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Venda Condicional</h1>
                        <p>Venda Condicional e todos seu items serão excluídos, os produtos retornaram ao estoque, deseja continuar?</p>                       
                                
                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirVenda()}>Deletar</button>
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