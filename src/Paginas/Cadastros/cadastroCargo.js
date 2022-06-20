import './cadastroCargo.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';

function Formulario() {
    const [tituloCargo, setTituloCargo] = useState('');

    const [filtro, setFiltro] = useState('');
    const [cargos, setCargos] = useState('');

    const [button, setButton] = useState('Cadastrar');
    const [titulo, setTitulo] = useState('Cadastrar Cargo');

    const [msg, setMsg] = useState('');

    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const [excCargo, setExcCargo] = useState('');
    const [msgProcurar, setMsgProcurar] = useState(0);

    async function validarDesc()
    {
        var msg = document.querySelector("#msgTitulo");
        if(tituloCargo == "")
        {
            msg.innerHTML = "<p>Digite o Título do cargo</p>";
            return false;
        }
        if(tituloCargo.length > 30)
        {
            msg.innerHTML = "<p>Título deve ter no máximo 30 caracteres</p>"
            return false;
        }
           
        return true;
    }

    async function validar()
    {
        let validar;

        validar = await validarDesc();
        if(!validar)
            return false;

        return true;
    }

    function limparAvisos()
    {
        document.querySelector("#msgTitulo").innerHTML = "";
    }

    async function limpar()
    {
        setSalvando(false);
        setExcluindo(false);
        setMsg('');

        setTituloCargo('');
        setExcCargo('');

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
                await api.post('/cadCargo',{
                    descricao: tituloCargo,
                }).then(
                    response => {
                       setMsg(response.data);
                    }
                )
                await carregarCargos();
                await limpar();
            }
            setSalvando(false);
        }
    }

    async function carregarCargos()
    {
        await api.get('/buscarCargos')
        .then((response)=>{
            setCargos(response.data);
        });
    }

    useEffect(()=>{
        carregarCargos();
    },[]);

    async function filtrarCargos()
    {
        if(filtro != "")
        {
            await api.get(`/filtrarCargos/${filtro}`)
            .then((response)=>{
                setCargos(response.data);
            })   
        }
        else
        {
            carregarCargos();
        }        
    }

    async function delCargo(idCargo)
    {
        if(idCargo != "" && idCargo != null)
        {
            await api.delete(`/deletarCargo/${idCargo}`)
            .then((response)=>{
                setMsg(response.data);
            })
        }   
    }

    async function buscarCargoEmUsuarios(idCargo)
    {
        if(idCargo != "" && idCargo != null)
        {
            return await api.get(`/buscarCargoUs/${idCargo}`)
            .then((response)=>{
                setMsgProcurar(response.data.length);
                //console.log(response.data.length);
                return response.data.length;
            })
        }   
    }

    async function cancelar()
    {   
        var a = document.querySelector(".deletebtn");
        document.getElementById('id01').style.display='none';
        setExcCargo('');
        setMsgProcurar('');
        if(a.classList.contains("disabled"))
            a.classList.remove("disabled");
    }

    async function excluirCargo()
    {
        if(excluindo === false)
        {
            setExcluindo(true);

            if(msgProcurar == 0)
            {
                await delCargo(excCargo);
                await carregarCargos();
            }

            document.getElementById('id01').style.display='none';
            setExcluindo(false);
        } 
    }

    async function definirExclusao(idCargo)
    {
        const retorno = await buscarCargoEmUsuarios(idCargo);
        document.getElementById('id01').style.display ='block';

        setExcCargo(idCargo);
        setMsgProcurar(retorno);

        if(retorno > 0)
            document.querySelector('.deletebtn').classList.toggle('disabled');
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>{titulo}</h1>
            </div>

            <div className="formulario">
                <div className='titulo'>
                    <h1>Gerenciar Cargo</h1>
                </div>

                <div className="formulario-padrao">
                    <label>Título*</label>
                    <input type="text" name="tituloCargo" id="tituloCargo" value={tituloCargo || ""} placeholder="Digite o Cargo" onChange={e=>{setTituloCargo(e.target.value);document.querySelector("#msgTitulo").innerHTML = ""}} required />
                    <div className='msg' id='msgTitulo'></div>
                </div>

                <div className="mensagemCli"></div>

                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>

            <div className='formulario'>

                    <div className='titulo'>
                        <h1>Cargos Cadastrados</h1>
                    </div>
                    <div className='formulario-padrao-tabela-cargos'>
                        <div className='inputs-buscar-cargos'>
                            <input type="search" placeholder='Pesquisar por título' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                            <button onClick={filtrarCargos}>OK</button>   
                        </div> 

                        <div className='div-tabela-cargo'>
                            <table className='tabela-cargo'>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        {localStorage.getItem("nivelAcesso") >= 60 &&
                                            <th>Ação</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargos != "" &&
                                        cargos.map(cargo =>(
                                            <tr key={cargo.id || ""} id="alterando">
                                                <td>{cargo.descricao || ""}</td>
                                                {localStorage.getItem("nivelAcesso") >= 60 &&
                                                    <td>
                                                        <button type="button" id='deletando' onClick={e => {definirExclusao(cargo.id)}}>
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
                        <h1>Deletar Cargo</h1>
                        {msgProcurar > 0 &&
                            <p>Este cargo está presente em alguns usuários, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <=0 &&
                            <p>Cargo será deletado, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirCargo()}>Deletar</button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;