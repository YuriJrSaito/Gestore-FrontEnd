import './Conta.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import Manual from '../../Components/manual.js'
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as FcIcons from 'react-icons/fc';

//todo: gravar dados para o pagamento não completo das parcelas

function Formulario() {
    
    const [idContaReceber, setIdContaReceber] = useState('');
    const [contasReceber, setContasReceber] = useState([]);
    const [parcelas, setParcelas] = useState([]);

    const [parcelaForm, setParcelaform] = useState(false);
    const [pValor, setPValor] = useState('');
    const [pDataPagamento, setPDataPagamento] = useState('');
    const [pDataVencimento, setPDataVencimento] = useState('');
    const [pNumParcela, setPNumParcela] = useState('');
    const [pIDFP, setPIDFP] = useState('');
    const [pNaoPago, setNaoPago] = useState(false);
    const [valorParcelado, setValorParcelado] = useState(0);

    const [excConta, setExcConta] = useState('');

    const [filtro, setFiltro] = useState('');
    const [msg, setMsg] = useState('');

    const [form, setForm] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);
    const [defQuitarParcela, setDefQuitarParcela] = useState(false);
    const [manual, setManual] = useState(false);
    const [ultimoId, setUltimoId] = useState('');

    const [msgProcurar, setMsgProcurar] = useState(0);
    const [buttonPagarParcela, setButtonPagarParcela] = useState('Pagar Inteiro');
    const [pagarParcelado, setPagarParcelado] = useState(false);
    const showPagarParcelado = () => {setPagarParcelado(!pagarParcelado); 
        {if(pagarParcelado===true)setButtonPagarParcela('Pagar Inteiro');
        else setButtonPagarParcela('Finalizar');}}

    async function carregarContas()
    {
        try{
            await api.get('/listarContasReceber')
            .then((response)=>{
                setContasReceber(response.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarTudo()
    {
        await carregarContas();
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function buscarContaEmVendas(idConta)
    {
        try{
            return await api.get(`/buscarContaEmVendas/${idConta}`)
            .then((response)=>{
                setMsgProcurar(response.data[0]);
                return response.data[0];
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function definirExclusao(idConta)
    {
        const retorno = await buscarContaEmVendas(idConta);

        setExcConta(idConta);
        setMsgProcurar(retorno);

        setDefExclusao(true);
    }

    async function verificarParcelasPagas(num)
    {
        for(var a=0; a<parcelas.length; a++)
        {
            if(num > parcelas[a].numParcela && parcelas[a].situacao === "Não pago")
            {
                setNaoPago(true);
                return false;
            }
        }
        setNaoPago(false);
        return true;
    }

    async function definirQuitarParcela(parcela)
    {
        setDefQuitarParcela(true);
        if(verificarParcelasPagas(parcela.numParcela))
        {
            setPIDFP(parcela.id);
            setPValor(parcela.valor);
            var dataHoje = moment();
            setPDataPagamento(dataHoje.format('DD-MM-YYYY'));
            setPDataVencimento(moment.utc(parcela.dataVencimento).format('DD-MM-YYYY'));
            setPNumParcela(parcela.numParcela);
        }
    }

    async function excluirConta()
    {
        await delConta(excConta);
        await carregarContas();

        setDefExclusao(false);
    }

    async function cancelar()
    {   
        setDefExclusao(false);
        setExcConta('');
        setMsgProcurar('');
        setPagarParcelado(false);
    }

    async function cancelarDefQuitarParcela()
    {   
        setDefQuitarParcela(false);
        setPagarParcelado(false);
        setPIDFP('');
        setPValor('');
        setPDataPagamento('');
        setPDataVencimento('');
        setPNumParcela('');
    }

    async function delConta(idConta)
    {
        if(idConta !== "")
        {
            try{
                await api.delete(`/deletarContaReceber/${idConta}`)
                .then((response)=>{
                    setMsg(response.data);
                })
            }
            catch(err){
                console.log(err);
            }
            setParcelas('');
            setParcelaform(false);
            setIdContaReceber('');
        }   
    }

    async function definirParcelas(idConta)
    {
        try{
            await api.get(`/buscarParcelasCR/${idConta}`)
            .then((response)=>{
                setIdContaReceber(idConta);
                setParcelaform(true);
                setParcelas(response.data);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function quitarParcela()
    {
        try{
            await api.post(`/quitarParcelaCR/${pIDFP}`)
            .then((response)=>{
                setMsg(response.data);
            })
            setDefQuitarParcela(false);
            setPagarParcelado(false);
            await definirParcelas(idContaReceber);
        }
        catch(err){
            console.log(err);
        }
    }

    async function pagarParcela()
    {
        if(parseFloat(valorParcelado) > parseFloat(pValor))
        {
            document.querySelector('#msgQuitarParcela').innerHTML = "<p>Valor Excede o Total Devido</p>";
        }
        else
        {
            if(parseFloat(pValor) > parseFloat(valorParcelado))
            {
                var valor = parseFloat(pValor) - parseFloat(valorParcelado);
                try{
                    await api.put(`/pagarParceladoCR/${pIDFP}/${valor}`)
                    .then((response)=>{
                        setMsg(response.data);
                    })
                    setDefQuitarParcela(false);
                    setPagarParcelado(false);
                }
                catch(err){
                    console.log(err);
                }
            }
            else
            {
                if(parseFloat(pValor) === parseFloat(valorParcelado))
                {
                    await quitarParcela();
                }
            }
            setValorParcelado(0);
            setPagarParcelado(false);
            setButtonPagarParcela("Pagar Inteiro")
            document.querySelector('#msgQuitarParcela').innerHTML = "";
            await definirParcelas(idContaReceber);
        }
    }

    async function ordenarParcelas()
    {
        parcelas.sort(function (x, y){
            return x.numParcela - y.numParcela;
        });
    }

    async function filtrarContas()
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

    const ativarManual = (id) => {
        setUltimoId(id);
        setManual(!manual);
    }

    return (
        <>
        <Header />
        {manual === true &&
            tabela === true &&
                <Manual ativarManual={ativarManual} origem={"cadContaTabelaR"} lastid={ultimoId}/>
        }
        {manual === true &&
            defExclusao === true &&
                <Manual ativarManual={ativarManual} origem={"cadContaEx"} lastid={ultimoId}/>
        }
        {manual === true &&
            defQuitarParcela === true &&
                <Manual ativarManual={ativarManual} origem={"cadContaParcela"} lastid={ultimoId}/>
        }
        <div className="background-conteudo">
            <div className='background'>
            {tabela === true &&
            <>
                <div className='background-tabelas'>
                    <div className="formulario-tabela">
                        <div className='titulo-cadastro'>
                            <div className='titulo'>
                                <h1>Contas a Receber</h1>
                            </div>
                            <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='inputs-buscar'>
                                <input type="search" id='filtro' placeholder='Pesquisar por cliente' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarContas()}}></input>
                                <input type="button" id='recarregar' value="Recarregar" onClick={carregarContas}></input>   
                            </div> 
                        </div>
                    </div>
                    <div className='row-conta'>
                        <div className='div-tabela'>
                            <table className='tabela' id='table'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Título</th>
                                        <th>Parcelas</th>
                                        <th>Valor Total(R$)</th>
                                        <th>Vencimento (primeira parcela)</th>
                                        {localStorage.getItem('nivelAcesso') >= 60 &&
                                            <th>&nbsp;</th>
                                        }
                                        </tr>
                                </thead>
                                <tbody>
                                    {contasReceber !== [] &&
                                        contasReceber.map(conta =>(
                                            <tr key={conta.id}>
                                                <td onClick={e=>definirParcelas(conta.id)}>{conta.nomeCliente}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>{conta.titulo}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>{conta.qtdeParcelas}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>R$ {conta.valorTotal}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>{moment.utc(conta.dataPrimeiroVencimento).format('DD-MM-YYYY')}</td>
                                                {localStorage.getItem('nivelAcesso') >= 60 &&
                                                    <td>
                                                        <a className="close">
                                                            <span id='tabela-excluir' aria-hidden="true" onClick={e => {definirExclusao(conta.id)}}>x</span>
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
                    <div className='row-conta'>
                        <div className='div-tabela'>
                            {parcelaForm &&
                                <div className='div-tabela'>
                                    <div className='titulo'>
                                        <h1>Parcelas</h1>
                                    </div>
                                    <table className='tabela'>
                                        <thead className='thead-dark'>
                                            <tr>
                                                <th>Número da Parcela</th>
                                                <th>Data Vencimento</th>
                                                <th>Valor Total(R$)</th>
                                                <th>Não Pago(R$)</th>
                                                <th>Situação</th>
                                                <th>Pagar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parcelas !== "" && ordenarParcelas() &&
                                                parcelas.map(parcela =>(
                                                    <tr key={parcela.id}>
                                                        <td>{parcela.numParcela}</td>
                                                        <td>{moment.utc(parcela.dataVencimento).format('DD-MM-YYYY')}</td>
                                                        <td>R$ {parcela.valorTotal}</td>
                                                        <td>R$ {parcela.valor}</td>
                                                        <td>{parcela.situacao}</td>
                                                        {
                                                            parcela.situacao === "Pago" &&
                                                            <td>
                                                                <a className="close-no">
                                                                    <span><FcIcons.FcCheckmark/></span>
                                                                </a>
                                                            </td>
                                                        }
                                                        {parcela.situacao === "Não pago" &&
                                                            <td>
                                                                <a className="close">
                                                                    <span id='tabela-quitar' aria-hidden="true" onClick={e => {definirQuitarParcela(parcela)}}>Quitar</span>
                                                                </a>
                                                            </td>
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
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

            {defExclusao === true &&
            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Conta</h1>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        {msgProcurar > 0 &&
                            <p>Esta conta esta vinculada a uma venda, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <= 0 &&
                            <p>Conta será deletada, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button id='cancelar' type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            {msgProcurar <= 0 &&
                                <button id='excluir' type="button" className="deletebtn" onClick={()=>excluirConta()}>Deletar</button>
                            }
                        </div>
                    </div>
                </form>
            </div>
            }

            {defQuitarParcela === true &&
            <div id="id02" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Quitar Parcela</h1>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        {pNaoPago === false &&
                            <>
                                <h1>Confira as informações</h1>
                                <p>Parcela: {pNumParcela}</p>
                                <p>Valor a ser pago: R${pValor}</p>
                                <p>Data de Pagamento: {pDataPagamento}</p>
                                <p>Data de Vencimento: {pDataVencimento}</p>

                                <input type='button' id="input-extra" value="Descontar Valor" onClick={showPagarParcelado}></input>
                                {pagarParcelado === true &&
                                    <>
                                        <div className='formulario-alert'>
                                            <div className="formulario-alert-number">
                                                <p>Descontar: (R$)</p>
                                                <input id='campo-extra' type="number" placeholder="Pagar parcelado" value={valorParcelado} onChange={e=>{{setValorParcelado(e.target.value);document.querySelector("#msgQuitarParcela").innerHTML=""}}}></input>
                                            </div>
                                            <div className='msg' id='msgQuitarParcela'></div>
                                        </div>
                                    </>
                                }

                                <div className="clearfix">
                                    <button id='cancelar' type="button" className="cancelbtn" onClick={()=>cancelarDefQuitarParcela()}>Cancelar</button>
                                    {buttonPagarParcela === "Pagar Inteiro" &&
                                        <button id='pargarParcela' type="button" className="deletebtn" onClick={quitarParcela}>{buttonPagarParcela}</button>
                                    }
                                    {buttonPagarParcela === "Finalizar" &&
                                        <button id='pargarParcela' type="button" className="deletebtn" onClick={pagarParcela}>{buttonPagarParcela}</button>
                                    }

                                </div>
                            </>
                        }
                        {
                            pNaoPago === true &&
                            <>
                                <p>Parcelas anteriores não pagas</p>
                                <div className="clearfix">
                                    <button id='cancelar' type="button" className="cancelbtn" onClick={()=>cancelarDefQuitarParcela()}>Cancelar</button>
                                </div>
                            </>
                        }
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