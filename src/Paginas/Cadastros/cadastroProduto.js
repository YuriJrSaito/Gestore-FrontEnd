import './cadastroProduto.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';

function Formulario() {

    const [codigoRef, setCodigoRef] = useState('');
    const [qtdeEstoque, setQtdeEstoque] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [valorCompra, setValorCompra] = useState('');

    const [idFornecedor, setFornecedor] = useState('');
    const [fornecedores, setFornecedores] = useState([]);

    const [idCategoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [btnNovaCategoria, setNovaCategoria] = useState(false);
    const [cadDescCategoria, setDescCategoria] = useState('');
    const [msgCategoria, setMsgCategoria] = useState('');
    const [categoriaMsgCor, setCategoriaCor] = useState('red');
    
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');

    const [produtos, setProdutos] = useState('');
    const [filtro, setFiltro] = useState('');

    const [altProd, setAltProd] = useState('');
    const [excProd, setExcProd] = useState('');

    const [salvando, setSalvando] = useState(false);

    const [msg, setMsg] = useState('');
    const [button, setButton] = useState('Salvar');
    const [tituloPagina, setTituloPagina] = useState('Cadastrar Produto');

    async function limpar()
    {
        setSalvando(false);
        setButton("Salvar");
        setMsg('');

        setCodigoRef('');
        setQtdeEstoque('');
        setTitulo('');
        setDescricao('');
        setValorUnitario('');
        setValorCompra('');
        setCategoria('');
        setFornecedor('');
        setImg1('');
        setImg2('');
        setImg3('');

        limparAvisos();
    }

    async function limparAvisos()
    {
        document.querySelector("#msgTitulo").innerHTML = "";
        document.querySelector("#msgCodigoRef").innerHTML = "";
        document.querySelector("#msgQtde").innerHTML = "";
        document.querySelector("#msgDescricao").innerHTML = "";
        document.querySelector("#msgValorUnitario").innerHTML = "";
        document.querySelector("#msgValorCompra").innerHTML = "";
    }

    async function validar()
    {
        var val = new Validar();

        if(await val.validarNome(titulo, 50, "#msgTitulo", "Título") &&
           await val.validarCodigo(codigoRef) &&
           await val.validarQuantidadeObrigatorio(qtdeEstoque, "#msgQtde", 0, "<p>Digite a quantidade</p>", "<p>Quantidade deve ser maior ou  igual a 0 (zero)</p>", "<p>Digite apenas Números</p>", "<p>Quantidade inválida</p>") &&
           await val.validarStringOpcional(descricao, 50, "#msgDescricao", "<p>Descrição deve ter no máximo 50 caracteres</p>") &&
           await val.validarValorUnitario(valorUnitario) &&
           await val.validarValorCompra(valorCompra) &&
           await val.validarFonecedores(fornecedores) &&
           await val.validarCategoria(idCategoria)
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

    async function gravarProduto()
    {
        try{
            await api.post('/cadProduto',{
                titulo: titulo,
                codigoRef: codigoRef,
                qtdeEstoque: qtdeEstoque,
                descricao: descricao,
                valorUnitario: parseFloat(valorUnitario),
                valorCompra: parseFloat(valorCompra),
                idFornecedor: idFornecedor,
                idCategoria: idCategoria,
                img1: img1,
                img2: img2,
                img3: img3,
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

    async function editarProduto()
    {
        try{
            await api.put('/altProduto',{
                idProduto: altProd,
                titulo: titulo,
                codigoRef: codigoRef,
                qtdeEstoque: qtdeEstoque,
                descricao: descricao,
                valorUnitario: parseFloat(valorUnitario),
                valorCompra: parseFloat(valorCompra),
                idFornecedor: idFornecedor,
                idCategoria: idCategoria,
                img1: img1,
                img2: img2,
                img3: img3,
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
                await gravarProduto();
            }
            else
            {
                await editarProduto();
            }
            await carregarTodosProdutos();
            await limpar();
            setSalvando(false);
        }
    }
    
    async function carregarTudo()
    {
        await carregarTodosProdutos();
        await carregarCategorias();
        await carregarFornecedores();
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function carregarTodosProdutos()
    {
        try{
            await api.get('/listarTodosProdutos')
            .then((response)=>{
                setProdutos(response.data);
            });
        }
        catch(err){
            console.log(err);
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

    async function filtrarProdutos()
    {
        if(filtro !== "")
        {
            try{
                await api.get(`/filtrarProdutos/${filtro}`)
                .then((response)=>{
                    setProdutos(response.data);
                })   
            }
            catch(err){
                console.log(err);
            }
        }
        else
        {
            await carregarTodosProdutos();
        }   
    }

    async function buscarCategoria(id)
    {
        try{
            await api.get(`/buscarCategoria/${id}`)
            .then((response)=>{
                setCategoria(response.data[0].id);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function alterarProduto(produto)
    {
        setButton('Alterar');
        limparAvisos();

        setAltProd(produto.id);
        setCodigoRef(produto.codigoReferencia);
        setQtdeEstoque(produto.qtdeEstoque);
        setTitulo(produto.titulo);
        setDescricao(produto.descricao);
        setValorUnitario(produto.valorUnitario);
        setValorCompra(produto.valorDeCompra);
        setCategoria(produto.id_categoria);
        setFornecedor(produto.id_fornecedor);

        if(produto.img1 !== null)
            setImg1(produto.img1);

        if(produto.img2 !== null)
            setImg2(produto.img2);

        if(produto.img3 !== null)
            setImg3(produto.img3);

        await buscarCategoria(produto.id_categoria);
    }

    async function delProduto(idProduto)
    {
        if(idProduto !== "" && idProduto !== null)
        {
            try{
                await api.delete(`/deletarProduto/${idProduto}`)
                .then((response)=>{
                    setMsg(response.data);
                })
                await limpar();
            }
            catch(err){
                console.log(err);
            }
        }   
    }

    async function excluirProduto()
    {
        try{
            await delProduto(excProd);
            await carregarTodosProdutos();

            document.getElementById('id01').style.display='none';
        }
        catch(err){
            console.log(err);
        }

    }

    async function definirExclusao(idProduto)
    {
        document.getElementById('id01').style.display ='block';
        setExcProd(idProduto);
    }

    function setarImg1(img)
    {
        var a = img.split("\\");;
        var b = a[2];
        setImg1(b);
    }
    function setarImg2(img)
    {
        var a = img.split("\\");;
        var b = a[2];
        setImg2(b);
    }
    function setarImg3(img)
    {
        var a = img.split("\\");;
        var b = a[2];
        setImg3(b);
    }

    async function definirBotaoNovaCategoria()
    {
        if(btnNovaCategoria === true)
            setNovaCategoria(false);
        else
            setNovaCategoria(true);
        novaCategoriaDef();
    }

    async function novaCategoriaDef()
    {
        setMsgCategoria(''); 
        setDescCategoria('');
    }

    async function carregarCategorias()
    {
        try{
            await api.get('/buscarCategorias').then((resp)=>{
                setCategorias(resp.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function cadastrarCategoria()
    {
        try{
            await api.post('/cadCategoria',{
                descricao: cadDescCategoria,
            }).then(
                response => {
                    setMsgCategoria(response.data);
                    if(response.data.includes("sucesso"))
                    {
                        setCategoriaCor('green');
                        carregarCategorias();
                    }
                    else
                        setCategoriaCor('red');
                }
            )
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='titulo-pagina'>
                <h1>{tituloPagina}</h1>
            </div>

            <div className='formulario-duplo'>
                <div className='main-row'>
                    <div className="formulario">
                        <div className='titulo'>
                            <h1>Informações do Produto</h1>
                        </div>

                        <div className="formulario-padrao">
                            <label>Título*</label>
                            <input type="text" name="titulo" id="titulo" value={titulo || ""} placeholder="Digite o título" onChange={e=>{setTitulo(e.target.value);document.querySelector("#msgTitulo").innerHTML = ""}} required />
                            <div className='msg' id='msgTitulo'></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Código de Referência</label>
                            <input type="text" name="codigoRef" id="codigoRef" value={codigoRef  || ""} placeholder="Digite o código de referência" onChange={e=>{setCodigoRef(e.target.value);document.querySelector("#msgCodigoRef").innerHTML = ""}}/>
                            <div className='msg' id='msgCodigoRef'></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Quantidade no Estoque*</label>
                            <input type="text" name="qtdeEstoque" id="qtdeEstoque" value={qtdeEstoque  || ""} placeholder="Digite a quantidade" onChange={e=>{setQtdeEstoque(e.target.value);document.querySelector("#msgQtde").innerHTML = ""}} required />
                            <div className='msg' id='msgQtde'></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Descrição</label>
                            <input type="text" name="descricao" id="descricao" value={descricao  || ""} placeholder="Digite a descrição" onChange={e=>{setDescricao(e.target.value);document.querySelector("#msgDescricao").innerHTML = ""}}/>
                            <div className='msg' id='msgDescricao'></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Valor Unitário*</label>
                            <input type="text" name="valorUnitario" id="valorUnitario" value={valorUnitario  || ""} placeholder="Digite o valor unitário" onChange={e=>{setValorUnitario(e.target.value);document.querySelector("#msgValorUnitario").innerHTML = ""}}/>
                            <div className='msg' id='msgValorUnitario'></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Valor de Compra</label>
                            <input type="text" name="valorCompra" id="valorCompra" value={valorCompra  || ""} placeholder="Digite o valor de compra" onChange={e=>{setValorCompra(e.target.value);document.querySelector("#msgValorCompra").innerHTML = ""}}/>
                            <div className='msg' id='msgValorCompra'></div>
                        </div>

                        <div className='formulario-padrao'>
                            {fornecedores !== "" &&
                                <>
                                    <label>Fornecedor*</label>
                                    <select id="selFornecedor" value={idFornecedor} onChange={e=>{setFornecedor(e.target.value);document.querySelector("#msgFornecedor").innerHTML = ""}}>
                                        <option key={0} value={0}>Escolha um Fornecedor</option>
                                        {fornecedores.map(fornecedor => (
                                            <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                                        ))}
                                    </select>
                                    <div className='msg' id='msgFornecedor'></div>
                                </>
                            }
                        </div>

                        <div className='formulario-padrao'>
                            {categorias !== "" &&
                                <>
                                    <label>Categoria*</label>
                                    <select id="selCategoria" value={idCategoria} onChange={e=>{setCategoria(e.target.value);document.querySelector("#msgCategoria").innerHTML = ""}}>
                                        <option key={0} value={0}>Escolha uma categoria</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.id} value={categoria.id}>{categoria.descricao}</option>
                                        ))}
                                    </select>
                                    <div className='msg' id='msgCategoria'></div>
                                </>
                            }
                            <input type="button" id='btnCargo' onClick={definirBotaoNovaCategoria} value="Nova Categoria"/> 
                            {btnNovaCategoria === true &&
                            <div className='formulario-padrao'>
                                    <label>Cadastrar Nova Categoria</label>
                                    <div className='adicionar-cargo'>
                                        <input type="text" name="cargo" id="cargo" value={cadDescCategoria || ""} onChange={e=>setDescCategoria(e.target.value)} placeholder="Digite a Categoria"/>
                                        <input type="button" onClick={cadastrarCategoria} value="Cadastrar"/> 
                                        {msgCategoria !== "" &&
                                            <p style={{color: categoriaMsgCor}}>{msgCategoria}</p>
                                        }
                                    </div>
                            </div>
                            }
                        </div>

                        <div className='formulario-padrao'>
                            <label>Imagens</label>
                            <div id="arquivos">
                                
                                <div id="div-arquivos">
                                    <form>
                                        <label htmlFor="fileUpload1">+</label>
                                        <input type="file" id="fileUpload1" onChange={e=>setarImg1(e.target.value)}></input>
                                    </form>
                                </div>
                                <div id="div-arquivos">
                                    <form>
                                        <label htmlFor="fileUpload2">+</label>
                                        <input type="file" id="fileUpload2" onChange={e=>setarImg2(e.target.value)}></input>
                                    </form>
                                </div>
                                <div id="div-arquivos">
                                    <form>
                                        <label htmlFor="fileUpload3">+</label>
                                        <input type="file" id="fileUpload3" onChange={e=>setarImg3(e.target.value)}></input>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="mensagemCli"></div>

                        <div className='titulo-bottom'>
                            <h2>( * ) Campos obrigatórios</h2>
                        </div>
                    </div>

                    <div className="formulario-tabela-produtos">
                        <div className='titulo'>
                            <h1>Produtos Cadastrados</h1>
                        </div>
                        <div className='formulario-padrao-tabela-produtos'>
                            <div className='inputs-buscar-produtos'>
                                <input type="search" placeholder='Pesquisar por título' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                                <button onClick={filtrarProdutos}>OK</button>   
                            </div> 

                            <div className='div-tabela-produto'>
                                <table className='tabela-produto'>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Quantidade Estoque</th>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <th>Ação</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtos !== "" &&
                                            produtos.map(produto =>(
                                                <tr key={produto.id} id="alterando">
                                                    <td onClick={e=>alterarProduto(produto)}>{produto.titulo}</td>
                                                    <td onClick={e=>alterarProduto(produto)}>{produto.qtdeEstoque}</td>
                                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                                        <td>
                                                            <button type="button" id='deletando' onClick={e => {definirExclusao(produto.id)}}>
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

            <div className='main-row'>

                {img1 !== "" &&
                    <div className="formulario-img">
                        <img className='' src={`/img//${img1}`} alt="Aqui fica a primeira imagem"></img>
                    </div>
                 }

                {img2 !== "" &&
                    <div className="formulario-img">
                        <img className='' src={`/img//${img2}`} alt="Aqui fica a segunda imagem"></img>                      
                    </div>
                }
                
                {img3 !== "" &&
                    <div className="formulario-img">
                        <img className='' src={`/img//${img3}`} alt="Aqui fica a terceira imagem"></img>
                    </div>
                }
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
                        <h1>Deletar Produto</h1>
                        <p>Produto será deletado, deseja continuar?</p>
                        
                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => document.getElementById('id01').style.display='none'}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirProduto()}>Deletar</button>
                        </div>
            
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;