import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import Manual from '../../Components/manual.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';
import * as BsIcons from 'react-icons/bs';

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

    const [form, setForm] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [defExclusao, setDefExclusao] = useState(false);
    const [manual, setManual] = useState(false);
    const [ultimoId, setUltimoId] = useState('');

    async function validar()
    {
        var val = new Validar();

        if(await val.validarDescObrigatoria(categoria, document.querySelector("#msgCategoria"), "<p>Digite a Categoria</p>", "<p>Categoria deve ter no máximo 30 caracteres</p>"))
            return true;
        return false;
    }

    function limparAvisos()
    {
        if(form === true)
            document.querySelector("#msgCategoria").innerHTML = "";
    }

    async function limpar()
    {
        setSalvando(false);
        setMsg('');
        setUltimoId('');
        setManual(false);
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
            setForm(false);
            setTabela(true);
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
        setDefExclusao(false);
        setExcCategoria('');
        setMsgProcurar('');
    }

    async function excluirCategoria()
    {
        if(msgProcurar === 0)
        {
            await delCategoria(excCategoria);
            await carregarCategorias();
        }
        setDefExclusao(false);
    }

    async function definirExclusao(idCategoria)
    {
        const retorno = await buscarCategoriasEmUsuarios(idCategoria);
        setDefExclusao(true);

        setExcCategoria(idCategoria);
        setMsgProcurar(retorno);
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
                <Manual ativarManual={ativarManual} origem={"cadCategoriaTabela"} lastid={ultimoId}/>
        }
        {manual === true &&
            form === true &&
                <Manual ativarManual={ativarManual} origem={"cadCategoriaForm"} lastid={ultimoId}/>
        }
        {manual === true &&
            defExclusao === true &&
                <Manual ativarManual={ativarManual} origem={"cadCategoriaEx"} lastid={ultimoId}/>
        }

        <div className="background-conteudo">
        <div className='background'>
            {tabela === true &&
                <div className="background-tabelas">
                    <div className='formulario-tabela'>
                        <div className='titulo-cadastro'>
                            <div className='titulo'>
                                <h1>Categorias</h1>
                            </div>
                            <div className='titulo-botoes'>
                                <input type="button" id='cadastrarNovo' value="Cadastrar novo" onClick={e=>{limpar();setForm(true);setTabela(false)}}></input>
                                <input type="button" value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                            </div>
                        </div>
                        <div className='formulario-padrao-tabela'>
                            <div className='inputs-buscar'>
                                <input type="search" id='filtro' placeholder='Pesquisar por título' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarCategoria()}}></input>
                                <input type="button" id='recarregar' onClick={carregarCategorias} value="Recarregar"></input> 
                            </div> 
                        </div>  
                    </div>

                    <div className='row'>
                        <div className='div-tabela'>
                            <table className='tabela' id='table'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>Categoria</th>
                                        {localStorage.getItem("nivelAcesso") >= 60 &&
                                            <th>&nbsp;</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias !== "" &&
                                        categorias.map(categoria =>(
                                            <tr key={categoria.id || ""} >
                                                <td>{categoria.descricao || ""}</td>
                                                {localStorage.getItem("nivelAcesso") >= 60 &&
                                                    <td>
                                                        <a className="close">
                                                            <span id='tabela-excluir' aria-hidden="true" onClick={e => {definirExclusao(categoria.id)}}>x</span>
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
                        <div className='titulo-flex'>
                            <div className='titulo-cont'>
                                <button id="retornar" onClick={e=>{setTabela(true);setForm(false)}}><BsIcons.BsArrowLeft/></button>
                                <h1>Informações</h1>
                            </div>
                            <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        </div>
                        <hr></hr>
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
                    <div className='div-botoes'>
                        <button id='limpar' type="button" onClick={limpar}>Limpar</button>
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

            {defExclusao === true &&
            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Categoria</h1>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        {msgProcurar > 0 &&
                            <p>Esta categoria está presente em alguns produtos, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <= 0 &&
                            <p>Categoria será deletada, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button id='cancelar' type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            {msgProcurar <= 0 &&
                                <button id='excluir' type="button" className="deletebtn" onClick={()=>excluirCategoria()}>Deletar</button>
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