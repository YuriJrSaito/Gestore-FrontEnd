import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';
import * as BsIcons from 'react-icons/bs';

function Formulario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [descricao, setDescricao] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone1, setTelefone1] = useState('');
    const [telefone2, setTelefone2] = useState('');

    const [filtro, setFiltro] = useState('');
    const [fornecedores, setFornecedores] = useState('');

    const [button, setButton] = useState('Salvar');
    const [titulo, setTitulo] = useState('Cadastrar Fornecedor');

    const [msg, setMsg] = useState('');

    const [altFor, setAltFor] = useState('');
    const [salvando, setSalvando] = useState(false);

    const [excFor, setExcFor] = useState('');
    const [msgProcurar, setMsgProcurar] = useState(0);

    const [form, setForm] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);

    async function validarTelefone(valor)
    {
        var reg=/^\(\d{2}\)\d{4,5}-\d{4}$/;
        if(valor.match(reg)!==null)
            return true;
        else
            return false;
    }

    async function formatarTelefone(valor)
    {
        var retorno = "";
        for(var x=0; x<valor.length; x++)
        {
            if(x === 0 && !valor.includes("("))
                retorno = "(";
            if(x === 2 && !valor.includes(")"))
                retorno += ")"
            if(x === 7 && !valor.includes("-"))
                retorno += "-";
            retorno += valor[x];
        }
        return retorno;
    }

    async function validarTel()
    {
        let tel;
        let retorno = true;
        if(telefone1 !== "")
        {
            tel = await formatarTelefone(telefone1);
            setTelefone1(tel);
            retorno = await validarTelefone(tel);
            if(!retorno)
                document.querySelector("#msgTel1").innerHTML = "<p>Telefone inválido</p>";
        }

        if(telefone2 !== "")
        {
            tel = await formatarTelefone(telefone2);
            setTelefone2(tel);
            retorno = await validarTelefone(tel);
            if(!retorno)
                document.querySelector("#msgTel2").innerHTML = "<p>Telefone inválido</p>";
        }  
        
        return retorno;
    }

    async function validar()
    {
        var val = new Validar();

        if(await val.validarNome(nome, 30, "#msgNome", "Nome") &&
           await val.formatarCnpj(cnpj) &&
           await val.validarEmail(email) &&
           await validarTel()
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

    function limparAvisos()
    {
        if(form === true)
        {
            document.querySelector("#msgNome").innerHTML = "";
            document.querySelector("#msgEmail").innerHTML = "";
            document.querySelector("#msgTel1").innerHTML = "";
            document.querySelector("#msgTel2").innerHTML = "";
            document.querySelector("#msgCnpj").innerHTML = "";
        }
    }

    async function limpar()
    {
        setSalvando(false);

        setButton('Salvar');
        setNome('');
        setCnpj('');
        setEmail('');
        setDescricao('');
        setTelefone1('');
        setTelefone2('');
        setAltFor('');

        limparAvisos();
    }

    async function gravarFornecedor()
    {
        try{
            await api.post('/cadFornecedor',{
                descricao: descricao,
                email: email,
                telefone1: telefone1,
                telefone2: telefone2,
                cnpj: cnpj,
                nome: nome,
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

    async function editarFornecedor()
    {
        try{
            await api.put('/altFornecedor',{
                idFornecedor: altFor,
                descricao: descricao,
                email: email,
                telefone1: telefone1,
                telefone2: telefone2,
                cnpj: cnpj,
                nome: nome,
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

    async function confirmarDados(e)
    {
        e.preventDefault();
        setMsg('');

        if(await validar())
        {
            setSalvando(true);
            if(button === "Salvar")
            {
                await gravarFornecedor();
            }
            else
            {
                await editarFornecedor();
            }
            await carregarFornecedores();
            await limpar();
            setSalvando(false);
            setForm(false);
            setTabela(true);
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

    useEffect(()=>{
        carregarFornecedores();
    },[]);


    async function filtrarFornecedores()
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

    async function recarregarFornecedores()
    {
        if(filtro !== "")
        {
            try{
                await api.get(`/filtrarFornecedores/${filtro}`)
                .then((response)=>{
                    setFornecedores(response.data);
                })   
            }
            catch(err){
                console.log(err);
            }
        }
        else
        {
            await carregarFornecedores();
        }
    }

    async function delFornecedor(idFornecedor)
    {
        if(idFornecedor !== "" && idFornecedor !== null)
        {
            try{
                await api.delete(`/deletarFornecedor/${idFornecedor}`)
                .then((response)=>{
                    setMsg(response.data);
                })
            }
            catch(err){
                console.log(err);
            }
            await limpar();
        }   
    }

    async function buscarFornecedoremProdutos(idFornecedor)
    {
        if(idFornecedor !== "" && idFornecedor !== null)
        {
            try{
                return await api.get(`/buscarFornecedor/${idFornecedor}`)
                .then((response)=>{
                    setMsgProcurar(response.data.length);
                    return response.data.length;
                })
            }
            catch(err){
                console.log(err);
            }
        }   
    }

    async function cancelar()
    {   
        setDefExclusao(false);
        setExcFor('');
        setMsgProcurar('');
    }

    async function excluirFornecedor()
    {
        if(msgProcurar === 0)
        {
            await delFornecedor(excFor);
            await carregarFornecedores();
        }
        setDefExclusao(false);
    }

    async function definirExclusao(idFornecedor)
    {
        const retorno = await buscarFornecedoremProdutos(idFornecedor);
        setDefExclusao(true);

        setExcFor(idFornecedor);
        setMsgProcurar(retorno);
    }

    async function alterarFornecedor(fornecedor)
    {
        /*if(fornecedor.CNPJ != null)
        {
            var val = fornecedor.CNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            setCnpj(val);
        }*/

        setTabela(false);
        setForm(true);
        setMsg('');
        setCnpj(fornecedor.CNPJ);
        setButton('Alterar');
        setNome(fornecedor.nome);
        setEmail(fornecedor.email);
        setDescricao(fornecedor.descricao);
        setTelefone1(await formatarTelefone(fornecedor.telefone1));
        setTelefone2(await formatarTelefone(fornecedor.telefone2));
        setAltFor(fornecedor.id);
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
        <div className='background'>
            {tabela === true &&
            <div className="background-tabelas">
                <div className="formulario-tabela">
                    <div className='titulo-cadastro'>
                        <div className='titulo'>
                            <h1>Fornecedores</h1>
                        </div>
                        <input type="button" value="Cadastrar novo" onClick={e=>{limpar();setForm(true);setTabela(false)}}></input>
                    </div>

                    <div className='formulario-padrao-tabela'>
                        <div className='inputs-buscar'>
                            <input type="search" id='filtro' placeholder='Pesquisar por Nome' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarFornecedores()}}></input>
                            <input type="button" onClick={recarregarFornecedores} value="Recarregar"></input>   
                        </div> 
                    </div>
                </div>           
                <div className='row'>
                    <div className='div-tabela'>
                        <table className='tabela' id='table'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Nome</th>
                                    <th>CNPJ</th>
                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                        <th>&nbsp;</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {fornecedores !== "" &&
                                    fornecedores.map(fornecedor =>(
                                        <tr key={fornecedor.id}>
                                            <td id='bold' onClick={e=>alterarFornecedor(fornecedor)}>{fornecedor.nome || ""}</td>
                                            <td onClick={e=>alterarFornecedor(fornecedor)}>{fornecedor.CNPJ || ""}</td>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <td>
                                                    <a className="close">
                                                        <span aria-hidden="true" onClick={e => {definirExclusao(fornecedor.id)}}>x</span>
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
            </div>
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
                    <label>Nome*</label>
                    <input type="text" name="nome" id="nome" value={nome || ""} placeholder="Digite o nome" onChange={e=>{setNome(e.target.value);document.querySelector("#msgNome").innerHTML = ""}} required />
                    <div className='msg' id='msgNome'></div>
                </div>

                <div className="formulario-padrao">
                    <label>CNPJ</label>
                    <input type="value" name="cnpj" id="cnpj" value={cnpj  || ""} placeholder="xx.xxx.xxx/xxxx-xx" onChange={e=>{setCnpj(e.target.value);document.querySelector("#msgCnpj").innerHTML = ""}}/>
                    <div className='msg' id='msgCnpj'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Email</label>
                    <input type="email" name="email" id="email" value={email  || ""} placeholder="exemplo@email.com" onChange={e=>{setEmail(e.target.value);document.querySelector("#msgEmail").innerHTML = ""}}/>
                    <div className='msg' id='msgEmail'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Telefone</label>
                    <input type="tel" name="telefone1" id="telefone1" value={telefone1  || ""} placeholder="(xx)xxxxx-xxxx" onChange={e=>{setTelefone1(e.target.value);document.querySelector("#msgTel1").innerHTML = ""}} required />
                    <div className='msg' id='msgTel1'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Telefone</label>
                    <input type="tel" name="telefone2" id="telefone2" value={telefone2  || ""} placeholder="(xx)xxxxx-xxxx" onChange={e=>{setTelefone2(e.target.value);document.querySelector("#msgTel2").innerHTML = ""}} required />
                    <div className='msg' id='msgTel2'></div>
                </div>

                <div className="mensagemCli"></div>

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
                    {salvando === true &&
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

            {defExclusao === true &&
            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Fornecedor</h1>
                        {msgProcurar > 0 &&
                            <p>Este fornecedor está presente em alguns produtos, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <= 0 &&
                            <p>Fornecedor será deletado, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            {
                                msgProcurar <= 0 &&
                                <button type="button" className="deletebtn" onClick={()=>excluirFornecedor()}>Deletar</button>
                            }
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