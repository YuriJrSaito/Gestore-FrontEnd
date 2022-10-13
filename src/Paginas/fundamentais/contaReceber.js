import './ContaPagar.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';
import * as FcIcons from 'react-icons/fc';

//todo: gravar dados para o pagamento não completo das parcelas

function Formulario() {
    
    const [idContaReceber, setIdContaReceber] = useState('');
    const [contasReceber, setContasReceber] = useState([]);
    const [parcelas, setParcelas] = useState([]);
    const [clientes, setClientes] = useState([]);

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
    const [fornecedores, setFornecedores] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgCor, setMsgCor] = useState('green');

    const [requisicao, setRequisicao] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [button, setButton] = useState('Salvar');
    const [tituloPagina, setTituloPagina] = useState('Contas a Receber');

    const [msgProcurar, setMsgProcurar] = useState(0);
    const [buttonPagarParcela, setButtonPagarParcela] = useState('Pagar Inteiro');
    const [pagarParcelado, setPagarParcelado] = useState(false);
    const showPagarParcelado = () => {setPagarParcelado(!pagarParcelado); 
        {if(pagarParcelado===true)setButtonPagarParcela('Pagar Inteiro');
        else setButtonPagarParcela('Finalizar');}}

    async function carregarContas()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get('/listarContasReceber')
            .then((response)=>{
                setContasReceber(response.data);
                console.log(response.data);
            });
            setRequisicao(false);
        }
    }

    async function carregarTudo()
    {
        await carregarContas();
    }

    /*async function buscarTodosClientes()
    {
        for(let x=0; x<contasReceber.length; x++)
        {
            let resp = await buscarClienteNome(contasReceber[x].id);
            setClientes([...clientes, resp]);
        }
    }*/

    /*async function buscarClienteNome(idConta)
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            let resp = await api.get(`/buscarClienteNome/${idConta}`)
            .then((response)=>{
                console.log(response.data);
                return response.data[0];
            });
            setRequisicao(false);
            return resp;
        }
    }*/

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function definirExclusao(idConta)
    {
        const retorno = await buscarContaEmVendas(idConta);
        document.getElementById('id01').style.display ='block';

        setExcConta(idConta);
        setMsgProcurar(retorno);

        if(retorno > 0)
            document.querySelector('.deletebtn').classList.toggle('disabled');
    }

    async function verificarParcelasPagas(num)
    {
        for(var a=0; a<parcelas.length; a++)
        {
            if(num > parcelas[a].numParcela && parcelas[a].situacao == "Não pago")
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
        document.getElementById('id02').style.display ='block';
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
        if(requisicao === false)
        {
            setRequisicao(true);

            await delConta(excConta);
            await carregarContas();

            document.getElementById('id01').style.display='none'; 
            setRequisicao(false);
        }
    }

    async function delConta(idConta)
    {
        if(idConta !== "")
        {
            if(requisicao === false)
            {
                setRequisicao(true);
                await api.delete(`/deletarContaReceber/${idConta}`)
                .then((response)=>{
                    setMsg(response.data);
                })
                setRequisicao(false);
            }
            setParcelas('');
            setParcelaform(false);
            setIdContaReceber('');
        }   
    }

    async function definirParcelas(idConta)
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get(`/buscarParcelasCR/${idConta}`)
            .then((response)=>{
                setIdContaReceber(idConta);
                setParcelaform(true);
                setParcelas(response.data);
            })
            setRequisicao(false);
        }
    }

    async function quitarParcela()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.post(`/quitarParcelaCR/${pIDFP}`)
            .then((response)=>{
                setMsg(response.data);
            })
            setRequisicao(false); 
            document.getElementById('id02').style.display='none';
            await definirParcelas(idContaReceber);
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
                if(requisicao === false)
                {
                    setRequisicao(true);
                    await api.put(`/pagarParceladoCR/${pIDFP}/${valor}`)
                    .then((response)=>{
                        setMsg(response.data);
                    })
                    setRequisicao(false); 
                    document.getElementById('id02').style.display='none';
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
        console.log(parcelas.sort(function (x, y){
            return x.numParcela - y.numParcela;
        }));
    }

    async function filtrarContas()
    {
        if(filtro !== "")
        {
            if(requisicao === false)
            {
                setRequisicao(true);
                await api.get(`/filtrarContasReceber/${filtro}`)
                .then((response)=>{
                    setMsg(response.data[0]);
                    setContasReceber(response.data[1]);
                })
                setRequisicao(false);
            }
        }
        else
        {
            await carregarContas();
        }
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>{tituloPagina}</h1>
            </div>

            <div className="formulario-tabela">
                <div className='titulo'>
                    <h1>Selecionar Conta</h1>
                </div>
                <div className='formulario-padrao-tabela'>
                    <div className='inputs-buscar'>
                        <input type="search" value={filtro} onChange={e => {setFiltro(e.target.value)}} placeholder='Pesquisar por Título'></input>
                        <button onClick={filtrarContas}>OK</button>   
                    </div> 

                    <div className='div-tabela'>
                        <table className='tabela'>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Título</th>
                                    <th>Parcelas</th>
                                    <th>Valor Total(R$)</th>
                                    <th>Vencimento (primeira parcela)</th>
                                    {localStorage.getItem('nivelAcesso') >= 60 &&
                                         <th>Ação</th>
                                    }
                                    </tr>
                            </thead>
                            <tbody>
                                {contasReceber !== [] &&
                                    contasReceber.map(conta =>(
                                        <tr key={conta.id} id="alterando">
                                            <td onClick={e=>definirParcelas(conta.id)}>{conta.nomeCliente}</td>
                                            <td onClick={e=>definirParcelas(conta.id)}>{conta.titulo}</td>
                                            <td onClick={e=>definirParcelas(conta.id)}>{conta.qtdeParcelas}</td>
                                            <td onClick={e=>definirParcelas(conta.id)}>R$ {conta.valorTotal}</td>
                                            <td onClick={e=>definirParcelas(conta.id)}>{moment.utc(conta.dataPrimeiroVencimento).format('DD-MM-YYYY')}</td>
                                            {localStorage.getItem('nivelAcesso') >= 60 &&
                                                <td>
                                                    <button type="button" id='deletando' onClick={e => {definirExclusao(conta.id)}}>
                                                        Excluir
                                                    </button>
                                                </td>
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {parcelaForm &&
                        <div className='div-tabela'>
                            <div className='titulo'>
                                <h1>Parcelas</h1>
                            </div>
                            <table className='tabela'>
                                <thead>
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
                                            <tr key={parcela.id} id="alterando">
                                                <td>{parcela.numParcela}</td>
                                                <td>{moment.utc(parcela.dataVencimento).format('DD-MM-YYYY')}</td>
                                                <td>R$ {parcela.valorTotal}</td>
                                                <td>R$ {parcela.valor}</td>
                                                <td>{parcela.situacao}</td>
                                                {
                                                    parcela.situacao === "Pago" &&
                                                    <td>
                                                        <FcIcons.FcCheckmark/>
                                                    </td>
                                                }
                                                {parcela.situacao === "Não pago" &&
                                                    <td>
                                                        <button type="button" id='deletando' onClick={e => {definirQuitarParcela(parcela)}}>
                                                            Quitar
                                                        </button>
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

            {msg !== "" &&
                <div className='formulario'>
                    <p id='msgSistema'>Mensagem do Sistema</p>
                    <p id='msgSistema'>{msg}</p>
                </div>    
            }

            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Conta</h1>
                        <p>Esta conta esta vinculada a uma venda, não será possivel excluir!</p>
                        
                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => document.getElementById('id01').style.display='none'}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirConta()}>Deletar</button>
                        </div>
            
                    </div>
                </form>
            </div>

            <div id="id02" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Quitar Parcela</h1>
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
                                                <input type="number" placeholder="Pagar parcelado" value={valorParcelado} onChange={e=>{{setValorParcelado(e.target.value);document.querySelector("#msgQuitarParcela").innerHTML=""}}}></input>
                                            </div>
                                            <div className='msg' id='msgQuitarParcela'></div>
                                        </div>
                                    </>
                                }

                                <div className="clearfix">
                                    <button type="button" className="cancelbtn" onClick={e => document.getElementById('id02').style.display='none'}>Cancelar</button>
                                    {buttonPagarParcela === "Pagar Inteiro" &&
                                        <button type="button" className="deletebtn" onClick={quitarParcela}>{buttonPagarParcela}</button>
                                    }
                                    {buttonPagarParcela === "Finalizar" &&
                                        <button type="button" className="deletebtn" onClick={pagarParcela}>{buttonPagarParcela}</button>
                                    }

                                </div>
                            </>
                        }
                        {
                            pNaoPago === true &&
                            <>
                                <p>Parcelas anteriores não pagas</p>
                                <div className="clearfix">
                                    <button type="button" className="cancelbtn" onClick={e => document.getElementById('id02').style.display='none'}>Cancelar</button>
                                </div>
                            </>
                        }
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;