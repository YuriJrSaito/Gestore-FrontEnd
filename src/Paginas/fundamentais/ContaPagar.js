import './Conta.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';
import * as FcIcons from 'react-icons/fc';
import * as BsIcons from 'react-icons/bs';
import '../../tabela/styleTabela.css';
//todo: gravar dados para o pagamento não completo das parcelas

function Formulario() {
    const [qtdeParcelas, setQtdeParcelas] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [titulo, setTitulo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataPrimeiroVencimento, setDataPrimeiroVencimento] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [idFornecedor, setFornecedor] = useState('');

    const [idContaPagar, setIdContaPagar] = useState('');
    const [contasPagar, setContasPagar] = useState('');
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
    const [fornecedores, setFornecedores] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgCor, setMsgCor] = useState('green');

    const [salvando, setSalvando] = useState(false);
    const [button, setButton] = useState('Salvar');
    const [tituloPagina, setTituloPagina] = useState('Contas a Pagar');

    const [form, setForm] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);
    const [defQuitarParcela, setDefQuitarParcela] = useState(false);

    const [buttonPagarParcela, setButtonPagarParcela] = useState('Pagar Inteiro');
    const [pagarParcelado, setPagarParcelado] = useState(false);
    const showPagarParcelado = () => {setPagarParcelado(!pagarParcelado); 
        {if(pagarParcelado===true)setButtonPagarParcela('Pagar Inteiro');
        else setButtonPagarParcela('Finalizar');}}

    async function limpar()
    {
        setSalvando(false);
        setButton("Salvar");

        setValorTotal('');
        setQtdeParcelas('');
        setTitulo('');
        setObservacao('');
        setDataEmissao('');
        setDataPrimeiroVencimento('');

        setTipoDocumento('');
        setFornecedor('');
        setIdContaPagar('');

        if(parcelaForm === true)
        {
            setParcelaform(false);
            setPValor('');
            setPDataPagamento('');
            setPDataVencimento('');
            setPNumParcela('');
            setPIDFP('');
        }

        limparAvisos();
    }

    async function limparAvisos()
    {
        if(form === true)
        {
            document.querySelector("#msgTitulo").innerHTML = "";
            document.querySelector("#msgObservacao").innerHTML = "";
            document.querySelector("#msgQtdeParcelas").innerHTML = "";
            document.querySelector("#msgValorTotal").innerHTML = "";
            document.querySelector("#msgEmissao").innerHTML = "";
            document.querySelector("#msgVencimento").innerHTML = "";
            document.querySelector("#msgFornecedor").innerHTML = "";
            document.querySelector("#msgTipoDocumento").innerHTML = "";
        }
    }

    async function validar()
    {
        var val = new Validar();

        if(await val.validarStringOpcional(titulo, 20, "#msgTitulo", "<p>Título deve ter no máximo 20 caracteres</p>") && 
           await val.validarStringOpcional(observacao, 30, "#msgObservacao", "<p>Observação deve ter no máximo 30 caracteres</p>")&&
           await val.validarQuantidadeObrigatorio(qtdeParcelas, "#msgQtdeParcelas", 12, "<p>Digite a quantidade</p>", "<p>Quantidade deve ser maior ou  igual a 0 (zero)</p>", "<p>Digite apenas Números</p>", "<p>Quantidade deve ser menor que 12</p>") &&
           await val.validarValorTotalObrigatorio(valorTotal) &&
           await val.validarDataEmissaoOpcional(dataEmissao) &&
           await val.validarDataVencimento(dataPrimeiroVencimento, dataEmissao) &&
           await val.validarStringOpcional(tipoDocumento, 10, "#msgTipoDocumento", "<p>Tipo de documento deve ter no máximo 10 caracteres</p>") &&
           await val.validarFornecedorObrigatorio(idFornecedor) 
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

    async function salvarContaPagar()
    {
        try{
            await api.post('/cadContaPagar',{
                valorTotal: valorTotal,
                qtdeParcelas: qtdeParcelas,
                titulo: titulo,
                observacao: observacao,
                dataEmissao: dataEmissao,
                tipoDocumento: tipoDocumento,
                idFornecedor: idFornecedor,
                dataPrimeiroVencimento: dataPrimeiroVencimento
            }).then(
                response => {
                    setMsg(response.data[0]);
                    setIdContaPagar(response.data[1]);
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
            setSalvando(true);
            if(button === "Salvar")
            {
                await salvarContaPagar();
                await carregarContas();
            }
            else
            {
                //fazer o editar
            }
            setSalvando(false);
            limpar();
        }
    }

    async function carregarFornecedores()
    {
        try{
            await api.get('/listarFornecedores')
            .then((response)=>{
                setFornecedores(response.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarContas()
    {
        try{
            await api.get('/listarContasPagar')
            .then((response)=>{
                setContasPagar(response.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarTudo()
    {
        await carregarFornecedores();
        await carregarContas();
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function definirExclusao(idConta)
    {
        setExcConta(idConta);
        setDefExclusao(true);
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

        document.getElementById('id01').style.display='none'; 
    }

    async function cancelar()
    {   
        setDefExclusao(false);
        setPagarParcelado(false);
        setExcConta('');
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
                await api.delete(`/deletarContaPagar/${idConta}`)
                .then((response)=>{
                    setMsg(response.data);
                })
            }
            catch(err){
                console.log(err);
            }
            setParcelas('');
            setParcelaform(false);
            setIdContaPagar('');
        }   
    }

    async function definirParcelas(idConta)
    {
        try{
            await api.get(`/buscarParcelasCP/${idConta}`)
            .then((response)=>{
                setIdContaPagar(idConta);
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
            await api.post(`/quitarParcelaCP/${pIDFP}`)
            .then((response)=>{
                setMsg(response.data);
            })
            setDefQuitarParcela(false);
            setPagarParcelado(false);
            await definirParcelas(idContaPagar);
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
                    await api.put(`/pagarParceladoCP/${pIDFP}/${valor}`)
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
            await definirParcelas(idContaPagar);
        }
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

    async function ordenarParcelas()
    {
        parcelas.sort(function (x, y){
            return x.numParcela - y.numParcela;
        });
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='background'>
            {tabela === true &&
            <>
                <div className='background-tabelas'>
                    <div className="formulario-tabela">
                        <div className='titulo-cadastro'>
                            <div className='titulo'>
                                <h1>Contas a Pagar</h1>
                            </div>
                            <input type="button" value="Cadastrar novo" onClick={e=>{limpar();setForm(true);setTabela(false)}}></input>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='inputs-buscar'>
                                <input type="search" id='filtro' placeholder='Pesquisar por Nome' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarContas()}}></input>
                                <input type="button" value="Recarregar" onClick={carregarContas}></input>   
                            </div> 
                        </div>
                    </div>
                    <div className='row-conta'>
                        <div className='div-tabela'>
                            <table className='tabela' id='table'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>Título</th>
                                        <th>Parcelas</th>
                                        <th>Valor Total(R$)</th>
                                        <th>Vencimento (primeira parcela)</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contasPagar !== "" &&
                                        contasPagar.map(conta =>(
                                            <tr key={conta.id}>
                                                <td onClick={e=>definirParcelas(conta.id)}>{conta.titulo}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>{conta.qtdeParcelas}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>R$ {conta.valorTotal}</td>
                                                <td onClick={e=>definirParcelas(conta.id)}>{moment.utc(conta.dataPrimeiroVencimento).format('DD-MM-YYYY')}</td>
                                                <td>
                                                    <a className="close">
                                                        <span aria-hidden="true" onClick={e => {definirExclusao(conta.id)}}>x</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='row-conta'>
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
                                                                <span aria-hidden="true" onClick={e => {definirQuitarParcela(parcela)}}>Quitar</span>
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
                {msg !== "" &&
                    <div className='formulario'>
                        <p id='msgSistema'>Mensagem do Sistema</p>
                        <p id='msgSistema'>{msg}</p>
                    </div>    
                }
            </>
            }

            {form === true &&
            <>
            <div className='background'>
            <div className="formulario">
                <div className='titulo'>
                    <div className='titulo-cont'>
                        <button id="retornar" onClick={e=>{setTabela(true);setForm(false)}}><BsIcons.BsArrowLeft/></button>
                        <h1>Informações</h1>
                    </div>
                </div>

                <div className="formulario-padrao">
                    <label>Título</label>
                    <input type="text" name="titulo" id="titulo" value={titulo} placeholder="Digite um Título" onChange={e=>{setTitulo(e.target.value);document.querySelector("#msgTitulo").innerHTML = ""}}/>
                    <div className='msg' id='msgTitulo'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Observação</label>
                    <input type="text" name="observacao" id="observacao" value={observacao} placeholder="Digite uma Observação" onChange={e=>{setObservacao(e.target.value);document.querySelector("#msgObservacao").innerHTML = ""}}/>
                    <div className='msg' id='msgObservacao'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Quantidade Parcelas *</label>
                    <input type="text" name="qtdeParcelas" id="qtdeParcelas" value={qtdeParcelas} placeholder="Quantidade de Parcelas" onChange={e=>{setQtdeParcelas(e.target.value);document.querySelector("#msgQtdeParcelas").innerHTML = ""}}/>
                    <div className='msg' id='msgQtdeParcelas'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Valor Total *</label>
                    <input type="text" name="valorTotal" id="valorTotal" value={valorTotal} placeholder="Valor Total" onChange={e=>{setValorTotal(e.target.value);document.querySelector("#msgValorTotal").innerHTML = ""}}/>
                    <div className='msg' id='msgValorTotal'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Data Emissão</label>
                    <input type="date" name="dataEmissao" id="dataEmissao" value={dataEmissao} onChange={e=>{setDataEmissao(e.target.value);document.querySelector("#msgEmissao").innerHTML = ""}}/>
                    <div className='msg' id='msgEmissao'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Vencimento Primeira Parcela *</label>
                    <input type="date" name="primeiroVencimento" id="primeiroVencimento" value={dataPrimeiroVencimento} onChange={e=>{setDataPrimeiroVencimento(e.target.value);document.querySelector("#msgVencimento").innerHTML = ""}}/>
                    <div className='msg' id='msgVencimento'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Tipo Documento</label>
                    <input type="text" name="tipoDocumento" id="tipoDocumento" value={tipoDocumento} placeholder="Digite o Tipo de Documento" onChange={e=>{setTipoDocumento(e.target.value);document.querySelector("#msgTipoDocumento").innerHTML = ""}}/>
                    <div className='msg' id='msgTipoDocumento'></div>
                </div>

                <div className='formulario-padrao'>
                    {fornecedores !== "" &&
                        <>
                            <label>Fornecedor*</label>
                            <select id="selFornecedor" value={idFornecedor} onChange={e=>{setFornecedor(e.target.value);document.querySelector("#msgFornecedor").innerHTML = ""}}>
                                <option key={0} value={0}>Escolha um fornecedor</option>
                                {fornecedores.map(fornecedor => (
                                    <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                                ))}
                            </select>
                            <div className='msg' id='msgFornecedor'></div>
                        </>
                    }
                </div>
                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>      

            {msg !== "" &&
                <div className='formulario'>
                    <p id='msgSistema'>Mensagem do Sistema</p>
                    <p id='msgSistema'>{msg}</p>
                </div>    
            }

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

            {defExclusao === true &&
                <div id="id01" className="modal">
                    <form className="modal-content">
                        <div className="container">
                            <h1>Deletar Conta</h1>
                            <p>A conta e todas as parcelas serão excluidas, deseja continuar?</p>
                            
                            <div className="clearfix">
                                <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                                <button type="button" className="deletebtn" onClick={()=>excluirConta()}>Deletar</button>
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
                                    <button type="button" className="cancelbtn" onClick={()=>cancelarDefQuitarParcela()}>Cancelar</button>
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
                                    <button type="button" className="cancelbtn" onClick={()=>cancelarDefQuitarParcela()}>Cancelar</button>
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