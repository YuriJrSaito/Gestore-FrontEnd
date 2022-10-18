import './cadastroCargo.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';

function Formulario() {
    const [categoria, setCategoria] = useState('');

    const [filtro, setFiltro] = useState('');
    const [categorias, setCategorias] = useState('');

    const [button, setButton] = useState('Cadastrar');
    const [titulo, setTitulo] = useState('Cadastrar Categoria');

    const [msg, setMsg] = useState('');

    const [salvando, setSalvando] = useState(false);

    const [excCategoria, setExcCategoria] = useState('');
    const [msgProcurar, setMsgProcurar] = useState(0);

    async function validar()
    {
        var val = new Validar();

        if(await val.validarDescObrigatoria(categoria, document.querySelector("#msgCategoria"), "<p>Digite a Categoria</p>", "<p>Categoria deve ter no máximo 30 caracteres</p>"))
            return true;
        return false;
    }

    function limparAvisos()
    {
        document.querySelector("#msgCategoria").innerHTML = "";
    }

    async function limpar()
    {
        setSalvando(false);
        setMsg('');

        setCategoria('');
        setExcCategoria('');

        limparAvisos();
    }

    async function confirmarDados(e)
    {
        e.preventDefault();
        
        setMsg('');
        if(await validar())
        {
            setSalvando(true);
            try{
                await api.post('/cadCategoria',{
                    descricao: categoria,
                }).then(
                    response => {
                        setMsg(response.data);
                    }
                )
            }
            catch(err){
                console.log(err);
            }
            await carregarCategorias();
            await limpar();
            setSalvando(false);
        }

    }

    async function carregarCategorias()
    {
        try{
            await api.get('/buscarCategorias')
            .then((response)=>{
                setCategorias(response.data);
            });
        }
        catch(err){
            console.log(err);
        }

    }

    useEffect(()=>{
        carregarCategorias();
    },[]);

    async function filtrarCategoria()
    {

        if(filtro !== "")
        {
            try{
                await api.get(`/filtrarCategorias/${filtro}`)
                .then((response)=>{
                    setCategorias(response.data);
                })   
            }
            catch(err){
                console.log(err);
            }
        }
        else
        {
            await carregarCategorias();
        }       

    }

    async function delCategoria(idCategoria)
    {
        if(idCategoria !== "" && idCategoria !== null)
        {
            try{
                await api.delete(`/deletarCategoria/${idCategoria}`)
                .then((response)=>{
                    setMsg(response.data);
                })
            }
            catch(err){
                console.log(err);
            }
        }   
    }

    async function buscarCategoriasEmUsuarios(idCategoria)
    {
        if(idCategoria !== "" && idCategoria !== null)
        {
            try{
                return await api.get(`/buscarCategoriaProd/${idCategoria}`)
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
        var a = document.querySelector(".deletebtn");
        document.getElementById('id01').style.display='none';
        setExcCategoria('');
        setMsgProcurar('');
        if(a.classList.contains("disabled"))
            a.classList.remove("disabled");
    }

    async function excluirCategoria()
    {
        if(msgProcurar === 0)
        {
            await delCategoria(excCategoria);
            await carregarCategorias();
        }

        document.getElementById('id01').style.display='none';
    }

    async function definirExclusao(idCategoria)
    {
        const retorno = await buscarCategoriasEmUsuarios(idCategoria);
        document.getElementById('id01').style.display ='block';

        setExcCategoria(idCategoria);
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
                    <h1>Gerenciar Categoria</h1>
                </div>

                <div className="formulario-padrao">
                    <label>Título*</label>
                    <input type="text" name="categoria" id="categoria" value={categoria || ""} placeholder="Digite a Categoria" onChange={e=>{setCategoria(e.target.value);document.querySelector("#msgCategoria").innerHTML = ""}} required />
                    <div className='msg' id='msgCategoria'></div>
                </div>

                <div className="mensagemCli"></div>

                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>

            <div className='formulario'>

                    <div className='titulo'>
                        <h1>Categorias Cadastradas</h1>
                    </div>
                    <div className='formulario-padrao-tabela-cargos'>
                        <div className='inputs-buscar-cargos'>
                            <input type="search" placeholder='Pesquisar por título' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                            <button onClick={filtrarCategoria}>OK</button>   
                        </div> 

                        <div className='div-tabela-cargo'>
                            <table className='tabela-cargo'>
                                <thead>
                                    <tr>
                                        <th>Categoria</th>
                                        {localStorage.getItem("nivelAcesso") >= 60 &&
                                            <th>Ação</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias !== "" &&
                                        categorias.map(categoria =>(
                                            <tr key={categoria.id || ""} id="alterando">
                                                <td>{categoria.descricao || ""}</td>
                                                {localStorage.getItem("nivelAcesso") >= 60 &&
                                                    <td>
                                                        <button type="button" id='deletando' onClick={e => {definirExclusao(categoria.id)}}>
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

            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Categoria</h1>
                        {msgProcurar > 0 &&
                            <p>Esta categoria está presente em alguns produtos, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <= 0 &&
                            <p>Categoria será deletada, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirCategoria()}>Deletar</button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;