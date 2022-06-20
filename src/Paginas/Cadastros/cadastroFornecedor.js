import './cadastroFornecedor.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';

function Formulario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [descricao, setDescricao] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone1, setTelefone1] = useState('');
    const [telefone2, setTelefone2] = useState('');

    const [filtro, setFiltro] = useState('');
    const [fornecedores, setFornecedores] = useState('');

    const [isOpen, setIsOpen] = useState(true);
    const [button, setButton] = useState('Salvar');
    const [titulo, setTitulo] = useState('Cadastrar Fornecedor');

    const [msg, setMsg] = useState('');

    const [altFor, setAltFor] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [alterando, setAlterando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const [excFor, setExcFor] = useState('');
    const [msgProcurar, setMsgProcurar] = useState(0);

    async function validarTelefone(valor)
    {
        var reg=/^\(\d{2}\)\d{4,5}-\d{4}$/;
        if(valor.match(reg)!==null)
            return true;
        else
            return false;
    }

    async function validarEmail(valor)
    {
        if(email == "")
            return true;
        var exp = /^[a-z0-9-_]+@[a-z0-9]+\.com/;
        if(exp.test(valor))
            return true;

        document.querySelector("#msgEmail").innerHTML = "<p>Email inválido</p>"
        return false;
    }

    async function validarCnpj(valor)
    {
        if(cnpj == "")
            return true;
        var exp = /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})/;
        if(exp.test(valor))
            return true;

        document.querySelector("#msgCnpj").innerHTML = "<p>CNPJ inválido</p>";
        return false;
    }

    async function formatarCnpj(valor)
    {
        var retorno = true;
        if(cnpj != "")
        {
            if(cnpj.length > 14)
            {
                document.querySelector("#msgCnpj").innerHTML = "<p>CNPJ inválido</p>";
                return false;
            }
            else
            {
                var val = await valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                setCnpj(val);
                retorno = await validarCnpj(val);
            }
        }
        return retorno;
    }

    async function formatarTelefone(valor)
    {
        var retorno = "";
        for(var x=0; x<valor.length; x++)
        {
            if(x == 0 && !valor.includes("("))
                retorno = "(";
            if(x == 2 && !valor.includes(")"))
                retorno += ")"
            if(x == 7 && !valor.includes("-"))
                retorno += "-";
            retorno += valor[x];
        }
        return retorno;
    }

    async function validarNome()
    {
        var msg = document.querySelector("#msgNome");
        if(nome == "")
        {
            msg.innerHTML = "<p>Digite o Nome</p>";
            return false;
        }
        if(nome.length > 30)
        {
            msg.innerHTML = "<p>Nome deve ter no máximo 30 caracteres</p>"
            return false;
        }
           
        return true;
    }

    async function validarTel()
    {
        let tel;
        let retorno = true;
        if(telefone1 != "")
        {
            tel = await formatarTelefone(telefone1);
            setTelefone1(tel);
            retorno = await validarTelefone(tel);
            if(!retorno)
                document.querySelector("#msgTel1").innerHTML = "<p>Telefone inválido</p>";
        }

        if(telefone2 != "")
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
        let validar;

        validar = await validarNome();
        if(!validar)
            return false;
        
        validar = await validarTel();
        if(!validar)
            return false;
        
        validar = await validarEmail(email)
        if(!validar)
            return false;

        validar = await formatarCnpj(cnpj)
        if(!validar)
            return false;

        return true;
    }

    function limparAvisos()
    {
        document.querySelector("#msgNome").innerHTML = "";
        document.querySelector("#msgEmail").innerHTML = "";
        document.querySelector("#msgTel1").innerHTML = "";
        document.querySelector("#msgTel2").innerHTML = "";
        document.querySelector("#msgCnpj").innerHTML = "";
    }

    async function limpar()
    {
        setSalvando(false);
        setAlterando(false);
        setExcluindo(false);
        
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

    async function confirmarDados(e)
    {
        e.preventDefault();
        
        if(salvando === false)
        {
            setSalvando(true);
            setMsg('');

            if(await validar())
            {
                if(button == "Salvar")
                {
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
                else
                {
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
                await carregarFornecedores();
                await limpar();
            }
            setSalvando(false);
        }
    }

    async function carregarFornecedores()
    {
        await api.get('/listarFornecedores')
        .then((response)=>{
            setFornecedores(response.data);
        });
    }

    useEffect(()=>{
        carregarFornecedores();
    },[]);

    async function filtrarFornecedores()
    {
        if(filtro != "")
        {
            await api.get(`/filtrarFornecedores/${filtro}`)
            .then((response)=>{
                setFornecedores(response.data);
            })   
        }
        else
        {
            carregarFornecedores();
        }        
    }

    async function delFornecedor(idFornecedor)
    {
        if(idFornecedor != "" && idFornecedor != null)
        {
            await api.delete(`/deletarFornecedor/${idFornecedor}`)
            .then((response)=>{
                setMsg(response.data);
            })
        }   
    }

    async function buscarFornecedoremProdutos(idFornecedor)
    {
        if(idFornecedor != "" && idFornecedor != null)
        {
            return await api.get(`/buscarFornecedor/${idFornecedor}`)
            .then((response)=>{
                setMsgProcurar(response.data.length);
                console.log(response.data.length);
                return response.data.length;
            })
        }   
    }

    async function cancelar()
    {   
        var a = document.querySelector(".deletebtn");
        document.getElementById('id01').style.display='none';
        setExcFor('');
        setMsgProcurar('');
        if(a.classList.contains("disabled"))
            a.classList.remove("disabled");
    }

    async function excluirFornecedor()
    {
        if(excluindo === false)
        {
            setExcluindo(true);

            if(msgProcurar == 0)
            {
                await delFornecedor(excFor);
                await carregarFornecedores();
            }

            document.getElementById('id01').style.display='none';
            setExcluindo(false);
        } 
    }

    async function definirExclusao(idFornecedor)
    {
        const retorno = await buscarFornecedoremProdutos(idFornecedor);
        document.getElementById('id01').style.display ='block';

        setExcFor(idFornecedor);
        setMsgProcurar(retorno);

        if(retorno > 0)
            document.querySelector('.deletebtn').classList.toggle('disabled');
    }

    async function alterarFornecedor(fornecedor)
    {
        if(alterando === false)
        {
            setAlterando(true);
            /*if(fornecedor.CNPJ != null)
            {
                var val = fornecedor.CNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                setCnpj(val);
            }*/

            setCnpj(fornecedor.CNPJ);

            setMsg('');

            setButton('Alterar');
            setNome(fornecedor.nome);
            setEmail(fornecedor.email);
            setDescricao(fornecedor.descricao);
            setTelefone1(await formatarTelefone(fornecedor.telefone1));
            setTelefone2(await formatarTelefone(fornecedor.telefone2));
            
            setAltFor(fornecedor.id);
            setAlterando(false);
        }
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>{titulo}</h1>
            </div>
            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario">

                        <div className='titulo'>
                            <h1>Informações</h1>
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

                    <div className="formulario-tabela-fornecedores">
                        <div className='titulo'>
                            <h1>Fornecedores Cadastrados</h1>
                        </div>
                        <div className='formulario-padrao-tabela-fornecedores'>
                            <div className='inputs-buscar-fornecedores'>
                                <input type="search" placeholder='Pesquisar por Nome' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                                <button onClick={filtrarFornecedores}>OK</button>   
                            </div> 

                            <div className='div-tabela-fornecedor'>
                                <table className='tabela-fornecedor'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CNPJ</th>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <th>Ação</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fornecedores != "" &&
                                            fornecedores.map(fornecedor =>(
                                                <tr key={fornecedor.id || ""} id="alterando">
                                                    <td onClick={e=>alterarFornecedor(fornecedor)}>{fornecedor.nome || ""}</td>
                                                    <td onClick={e=>alterarFornecedor(fornecedor)}>{fornecedor.CNPJ || ""}</td>
                                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                                        <td>
                                                            <button type="button" id='deletando' onClick={e => {definirExclusao(fornecedor.id)}}>
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
                        </div>
                    </div>            
                </div>
            </div>

            {msg != "" &&
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
                        {salvando == false && button}
                    </button>
                    {  salvando == true &&
                        
                        <button className='salvando' type="button">
                        {
                            salvando == true && <FontAwesomeIcon icon={faCircleNotch} className="fa-spin"/>
                        }
                        </button>
                    }
                </div>
            </div>

            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Fornecedor</h1>
                        {msgProcurar > 0 &&
                            <p>Este fornecedor está presente em alguns produtos, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <=0 &&
                            <p>Fornecedor será deletado, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirFornecedor()}>Deletar</button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;