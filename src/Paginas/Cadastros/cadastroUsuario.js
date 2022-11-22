import './cadastroUsuario.css';
import '../../App.css';
import '../../tabela/styleTabela.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import Manual from '../../Components/manual.js'
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';
import * as BsIcons from 'react-icons/bs';

function Formulario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState(0);
    const [cpf, setCpf] = useState('');
    const [sexo, setSexo] = useState('');

    const [bairro, setBairro] = useState('');
    const [rua, setRua] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    const [dataEmissao, setDataEmissao] = useState('');
    const [dataDemissao, setDataDemissao] = useState('');
    const [salario, setSalario] = useState('');
    const [nivelAcesso, setNivelAcesso] = useState(0);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const [cargos, setCargos] = useState([]);
    const [idCargo, setIdcargo] = useState('');
    const [cadDescCargo, setCadDescCargo] = useState('');
    const [btnNovoCargo, setBtnNovoCargo] = useState(false);
    const [msgCargo, setMsgCargo] = useState('');
    const [cargoMsgCor, setCargoMsgCor] = useState('red');

    const [verContatos, setContatos] = useState([]);
    const [telefone, setTelefone] = useState([]);

    const [telefoneForm, setTelefoneForm] = useState(true);
    const [button, setButton] = useState('Salvar');
    const [titulo, setTitulo] = useState('Cadastrar Usuário');
    const [EnderecoOpen, setEnderecoOpen] = useState(false);

    const [filtro, setFiltro] = useState('');
    const [usuarios, setUsuarios] = useState('');
    const [msg, setMsg] = useState('');
    const [msgCor, setMsgCor] = useState("green");

    const [altCA, setCA] = useState('');
    const [altEnd, setAltEnd] = useState('');
    const [altTel, setAltTel] = useState('');
    const [altUs, setAltUs] = useState('');
    const [salvando, setSalvando] = useState(false);

    const [excAcesso, setExcAcesso] = useState('');
    const [excTel, setExcTel] = useState('');
    const [excEnd, setExcEnd] = useState('');
    const [excUs, setExcUs] = useState('');

    const [form, setForm] = useState(false);
    const [tabela, setTabela] = useState(true);
    const [formDados, setFormDados] = useState(false);
    const [formAcesso, setFormAcesso] = useState(false);

    const [defExclusao, setDefExclusao] = useState(false);
    const [msgProcurar, setMsgProcurar] = useState(0);
    const [manual, setManual] = useState(false);
    const [ultimoId, setUltimoId] = useState('');

    function validarTelefone(valor)
    {
        var reg=/^\(\d{2}\)\d{4,5}-\d{4}$/;
        if(valor.match(reg)!==null)
            return true;
        else
            return false;
    }

    async function Excluir(codigo)
    {
        setContatos(verContatos.filter(verContatos=>verContatos.codigo!==codigo));
    }

    async function addLista()
    {
        let mensagem = document.querySelector("#mensagemContato");
        mensagem.innerHTML="";
        var valor = telefone;
        if(verContatos.length < 3)
        {
            valor = await formatarTelefone();
            if(validarTelefone(valor))
            {
                setTelefone(valor);
                let tam=verContatos.length;
                const data= {
                    codigo:tam,
                    telefone: valor,
                    };
                setTelefone('');
                setContatos([...verContatos, data]); //contatos é um estado (do tipo vetor)   
            } 
            else
            {
                mensagem.innerHTML+="<p>Número não válido</p>";
            }
        }
        else
        {
            mensagem.innerHTML="<p>Número máximo de telefones atingido</p>";
        }
    }

    async function formatarTelefone()
    {
        var valor = "";
        for(var x=0; x<telefone.length; x++)
        {
            if(x === 0 && !telefone.includes("("))
                valor = "(";
            if(x === 2 && !telefone.includes(")"))
                valor += ")"
            if(x === 7 && !telefone.includes("-"))
                valor += "-";
            valor += telefone[x];
        }
        return valor;
    }

    async function validarTelefoneExiste()
    {
        if(verContatos.length === 0)
        {
            document.querySelector("#mensagemContato").innerHTML = "<p>Insira pelo menos 1 Telefone</p>";
            return false;
        }
        return true;
    }

    async function delEndereco(idEndereco)
    {
        if(idEndereco !== null && idEndereco !== "")
        {
            try{
                await api.delete(`/deletarEndereco/${idEndereco}`)
                .then((response)=>{
                    console.log(response.data);
                })
            }
            catch(err){
                console.log(err);
            }
        }
    }

    async function delTelefone(idTelefone)
    {
        try{
            if(idTelefone !== null && idTelefone !== "")
            {
                await api.delete(`/deletarTelefone/${idTelefone}`)
                .then((response)=>{
                    console.log(response.data);
                })
            }
        }
        catch(err){
            console.log(err);
        }
    }

    async function delUsuario(idUSuario)
    {
        if(idUSuario !== "" && idUSuario !== null)
        {
            try{
                await api.delete(`/deletarUsuario/${idUSuario}`)
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

    async function delAcesso(idCA)
    {
        if(idCA !== "" && idCA !== null)
        {
            try{
                await api.delete(`/deletarAcesso/${idCA}`)
                .then((response)=>{
                    setMsg(response.data);
                    console.log(response.data, "controle acesso deletado");
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
        setExcEnd('');
        setExcTel('');
        setExcAcesso('');
        setExcUs('');

        setMsgProcurar('');
    }

    async function excluirUsuario()
    {
        if(msgProcurar === 0)
        {
            await delEndereco(excEnd);
            await delTelefone(excTel);
            await delUsuario(excUs);
            await delAcesso(excAcesso);
    
            await carregarUsuarios();
        }
        setDefExclusao(false);
    }

    async function buscarUsuriosEmVendas(idUsuario)
    {
        if(idUsuario !== "" && idUsuario !== null)
        {
            try{
                return await api.get(`/buscarUsVenda/${idUsuario}`)
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

    async function definirExclusao(idUsuario, idTelefone, idEndereco, idCA)
    {
        const retorno = await buscarUsuriosEmVendas(idUsuario);
        setDefExclusao(true);

        setExcAcesso(idCA);
        setExcTel(idTelefone);
        setExcEnd(idEndereco);
        setExcUs(idUsuario);
        setMsgProcurar(retorno);
    }

    async function validarUsuarioDados()
    {
        var val = new Validar();
        if(await val.validarCargo(idCargo)&&
            await val.validarNivel(nivelAcesso)&&
            await val.validarSalario(salario)&&
            await val.validarDataEmissaoObrigatoria(dataEmissao)&&
            await val.validarDataDemissao(dataDemissao, dataEmissao)
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

    async function validarUsuarioAcesso()
    {
        var val = new Validar();

        if(await val.validarLogin(login)&&
            await val.validarSenha(senha)
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
    
    async function validar()
    {
        var val = new Validar();

        if(await val.validarNome(nome, 50, "#msgNome", "Nome") && 
           await val.formatarCPF(cpf)&&
           await val.validarIdade(idade)&&
           await val.validarEmail(email)&&
           await validarTelefoneExiste()
        )
        {
            if(EnderecoOpen === true)
            {
                if(
                    await val.formatarCep(cep)&&
                    await val.validarNumero(numero)&&
                    await val.validarComplemento(complemento)&&
                    await val.validarCidade(cidade)&&
                    await val.validarBairro(bairro)&&
                    await val.validarRua(rua)
                )
                    return true;
                else
                {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    return false;
                }
            }
            return true;
        }
        else
        {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return false;
        }
    } 
    
    async function proximoUsuarioDados()
    {
        let resp = await validar();
        if(resp === true)
        {
            setForm(false);
            await setFormDados(true);
            await carregarCargos();
        }
    }

    async function proximoUsuarioAcesso()
    {
        let resp = await validarUsuarioDados();
        if(resp === true)
        {
            setFormDados(false);
            setFormAcesso(true);
        }
    }

    function limparAvisos()
    {
        if(form === true)
        {
            document.querySelector("#msgNome").innerHTML = "";
            document.querySelector("#msgCPF").innerHTML = "";
            document.querySelector("#msgIdade").innerHTML = "";
            document.querySelector("#msgEmail").innerHTML = "";
            document.querySelector("#mensagemContato").innerHTML = "";
        }

        if(EnderecoOpen === true)
        {
            let resp = document.querySelector("#msgCep");
            if(resp != null) resp.innerHTML = "";
            resp = document.querySelector("#msgCidade");
            if(resp != null) resp.innerHTML = "";
            resp = document.querySelector("#msgRua");
            if(resp != null) resp.innerHTML = "";
            resp = document.querySelector("#msgNumero");
            if(resp != null) resp.innerHTML = "";
            resp = document.querySelector("#msgBairro");
            if(resp != null) resp.innerHTML = "";
            resp = document.querySelector("#msgComplemento");
            if(resp != null) resp.innerHTML = "";
        }

        if(formDados === true)
        {
            document.querySelector("#msgCargo").innerHTML = "";
            document.querySelector("#msgNivel").innerHTML = "";
            document.querySelector("#msgSalario").innerHTML = "";
            document.querySelector("#msgEmissao").innerHTML = "";
            document.querySelector("#msgDemissao").innerHTML = "";
        }

        if(formAcesso === true)
        {
            document.querySelector("#msgLogin").innerHTML = "";
            document.querySelector("#msgSenha").innerHTML = "";
        }
    }

    async function limpar()
    {
        setSalvando(false);
        setButton("Salvar");
        setMsg('');

        setManual(false);
        setUltimoId('');

        setNome('');
        setEmail('');
        setIdade('');
        setCpf('');

        setBairro('');
        setRua('');
        setCidade('');
        setCep('');
        setNumero('');
        setComplemento(''); 
            
        setAltTel('');
        setAltEnd('');
        setAltUs('');

        setContatos([]);
        setTelefone('');

        setLogin('');
        setSenha('');
        setSalario('');
        setDataDemissao('');
        setDataEmissao('');
        setNivelAcesso(0);
        setIdcargo(0);

        if(form === true)
        {
            document.querySelector("#SexoF").checked = false;
            document.querySelector("#SexoM").checked = false;
        }

        limparAvisos();
    }

    async function gravarUsuario(dataD)
    {
        try{
            let resp = await api.post('/cadUsuario',{
                nome: nome,
                email: email,
                idade: idade,
                sexo: sexo,
                cpf: cpf,
                telefones: verContatos,
                cep: cep,
                cidade: cidade,
                rua: rua,
                bairro: bairro,
                numero: numero,
                complemento: complemento,
                login: login,
                senha: senha,
                nivelAcesso: nivelAcesso,
                idCargo: idCargo,
                dataDemissao: dataD,
                dataEmissao: dataEmissao,
                salario: salario,
            }).then(
                response => {
                    if(response.data.includes("erro"))
                    {
                        document.getElementById("msgLogin").innerHTML = "<p>Escolha outro Login de acesso</p>";
                        return false;
                    }
                    else
                    {
                        setMsg(response.data);
                        return true;
                    }
                }
            )
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function editarUsuario(dataD)
    {
        try{
            let resp = await api.put('/altUsuario',{
                idUsuario: altUs,
                nome: nome,
                email: email,
                idade: idade,
                sexo: sexo,
                cpf: cpf,
                telefones: verContatos,
                cep: cep,
                cidade: cidade,
                rua: rua,
                bairro: bairro,
                numero: numero,
                complemento: complemento,
                login: login,
                senha: senha,
                nivelAcesso: nivelAcesso,
                idCargo: idCargo,
                dataDemissao: dataD,
                dataEmissao: dataEmissao,
                salario: salario,
                idTelefone: altTel,
                idEndereco: altEnd,
                idCA: altCA,
            }).then(
                response => {
                    if(response.data.includes("erro"))
                    {
                        document.getElementById("msgLogin").innerHTML = "<p>Escolha outro Login de acesso</p>";
                        return false;
                    }
                    else
                    {
                        setMsg(response.data);
                        return true;
                    }
                }
            )
            return resp;
        }
        catch(err){
            console.log(err);
        }
    }

    async function confirmarDados(e)
    {
        var dataD = dataDemissao;
        let resp = false;
        if(dataDemissao === undefined)
            dataD = null;

        if(await validarUsuarioAcesso())
        {
            setSalvando(true);
            if(button === "Salvar")
            {
                resp = await gravarUsuario(dataD);
            }
            else
            {  
                resp = await editarUsuario(dataD);
            }
            setSalvando(false);
            if(resp === true)
            {
                await carregarTudo();
                await limpar();
                setFormAcesso(false);
                setTabela(true);
            }
        }
    }

    async function cadastrarCargo()
    {
        try{
            await api.post('/cadCargo',{
                descricao: cadDescCargo,
            }).then(
                response => {
                    setMsgCargo(response.data);
                    if(response.data.includes("sucesso"))
                    {
                        setCargoMsgCor('green');
                        carregarCargos();
                    }
                    else
                        setCargoMsgCor('red');
                }
            )
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarTudo()
    {
        await carregarUsuarios();
    }

    async function carregarUsuarios()
    {
        try{
            await api.get('/listarTodosUsuarios')
            .then((response)=>{
                setUsuarios(response.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarCargos()
    {
        try{
            await api.get('/buscarCargos').then((resp)=>{
                setCargos(resp.data);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        carregarTudo();
    },[]);

    async function definirBotaoNovoCargo()
    {
        if(btnNovoCargo === true)
            setBtnNovoCargo(false);
        else
            setBtnNovoCargo(true);
        novoCargoDef();
    }

    async function novoCargoDef()
    {
        setMsgCargo(''); 
        setCadDescCargo('');
    }

    async function filtrarUsuarios()
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

    async function carregarTelefones(idTelefone)
    {
        try{
            await api.get(`/buscarTelefones/${idTelefone}`)
            .then((response)=>{
                var telefonesVet = [response.data[0].telefone1, response.data[0].telefone2, response.data[0].telefone3];
                var vet2 = [];
                for(var x=0; x<telefonesVet.length; x++)
                {
                    if(telefonesVet[x] !== null)
                    {
                        const data = {
                            codigo: x,
                            telefone: telefonesVet[x],
                        };
                        vet2[x] = data;
                    } 
                }
                setContatos(vet2);
            })   
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarControleAcesso(idCA)
    {
        try{
            await api.get(`/buscarControleAcesso/${idCA}`)
            .then((response)=>{
                setLogin(response.data[0].login);
                setSenha(response.data[0].senha);
                setNivelAcesso(response.data[0].nivel_acesso);
            })  
        }
        catch(err){
            console.log(err);
        }
    }

    async function carregarCargo(idCargo)
    {
        try{
            await api.get(`/buscarCargo/${idCargo}`)
            .then((response)=>{
                setIdcargo(response.data[0].id);
            })  
        }
        catch(err){
            console.log(err);
        }
    }

    async function alterarUsuario(usuario)
    {
        setTabela(false);
        await setForm(true)
        limpar();
        verContatos.length = 0;

        if(usuario.idade === null)
            setIdade('');
        else
            setIdade(usuario.idade);

        setNome(usuario.nome);
        setCpf(usuario.cpf);
        setEmail(usuario.email);
        setAltEnd(usuario.id_endereco);
        setAltTel(usuario.id_telefone);
        setAltUs(usuario.id);
        setCA(usuario.id_controle_acesso);
        setDataEmissao(moment.utc(usuario.dataEmissao).format('YYYY-MM-DD'));
        setSalario(usuario.salario);
        setSexo(usuario.sexo);

        if(usuario.dataDemissao === null)
            setDataDemissao("");  
        else
            setDataDemissao(moment.utc(usuario.dataDemissao).format('YYYY-MM-DD'));


        if(usuario.sexo === "Masculino")
            definirM();
        if(usuario.sexo === "Feminino")
            definirF();


        if(EnderecoOpen === true)
        {
            await definirEnderecoOpen();
        }

        await carregarTelefones(usuario.id_telefone);
        await carregarControleAcesso(usuario.id_controle_acesso);
        await carregarCargo(usuario.id_cargo);

        setButton("Alterar");
    }

    async function definirEnderecoOpen()
    {
        await carregarEnd();
        if(EnderecoOpen === false)
            setEnderecoOpen(true);
        else
            setEnderecoOpen(false);
    }

    async function carregarEnd()
    {
        if(button === "Alterar")
        {
            try{
                await api.get(`/buscarEndereco/${altEnd}`)
                .then((response)=>{
                    if(response.data.length > 0)
                    {
                        if(response.data[0].cep === null || response.data[0].cep === [])
                            setCep('');
                        else
                            setCep(response.data[0].cep);
        
                        if(response.data[0].cidade === null)
                            setCidade('');
                        else
                            setCidade(response.data[0].cidade);
        
                        if(response.data[0].rua === null)
                            setRua('');
                        else
                            setRua(response.data[0].rua);
        
                        if(response.data[0].numero === null)
                            setNumero('');
                        else
                            setNumero(response.data[0].numero);
        
                        if(response.data[0].bairro === null)
                            setBairro('');
                        else
                            setBairro(response.data[0].bairro);
        
                        if(response.data[0].complemento === null)
                            setComplemento('');
                        else
                            setComplemento(response.data[0].complemento);
                    }
                })  
            }
            catch(err){
                console.log(err);
            }
        }
    }

    async function definirF()
    {
        var inputSexo = document.querySelector("#SexoM").checked;
        if(inputSexo === true)
            document.querySelector("#SexoM").checked = false;
        
        document.querySelector("#SexoF").checked = true;
    }

    async function definirM()
    {
        var inputSexo = document.querySelector("#SexoF").checked;
        if(inputSexo === true)
            document.querySelector("#SexoF").checked = false;

        document.querySelector("#SexoM").checked = true;
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
                <Manual ativarManual={ativarManual} origem={"cadUsuarioTabela"} lastid={ultimoId}/>
        }
        {manual === true &&
            form === true &&
                <Manual ativarManual={ativarManual} origem={"cadUsuarioForm"} lastid={ultimoId}/>
        }
        {manual === true &&
            formDados === true &&
                <Manual ativarManual={ativarManual} origem={"cadUsuarioFormDados"} lastid={ultimoId}/>
        }
        {manual === true &&
            formAcesso === true &&
                <Manual ativarManual={ativarManual} origem={"cadUsuarioFormAcesso"} lastid={ultimoId}/>
        }
        {manual === true &&
            defExclusao === true &&
                <Manual ativarManual={ativarManual} origem={"cadUsuarioEx"} lastid={ultimoId}/>
        }
        <div className="background-conteudo">
        <div className='background'>
            {tabela === true &&
            <div className="background-tabelas">
                <div className='formulario-tabela'>
                    <div className='titulo-cadastro'>
                        <div className='titulo'>
                            <h1>Usuarios</h1>
                        </div>
                        <div className='titulo-botoes'>
                            <input type="button" id='cadastrarNovo' value="Cadastrar novo" onClick={e=>{carregarCargos();limpar();setForm(true);setTabela(false)}}></input>
                            <input type="button" value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        </div>
                    </div>
                    <div className='formulario-padrao-tabela'>
                        <div className='inputs-buscar'>
                            <input type="search" id='filtro' placeholder='Pesquisar por Nome' value={filtro} onChange={e=>{setFiltro(e.target.value);filtrarUsuarios()}}></input>
                            <input id="recarregar" type="button" onClick={carregarUsuarios} value="Recarregar"></input> 
                        </div> 
                    </div>
                </div>
                <div className='row'>
                    <div className='div-tabela'>
                        <table className='tabela' id='table'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                        <th>&nbsp;</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios !== "" &&
                                    usuarios.map(usuario =>(
                                        <tr key={usuario.id}>
                                            <td onClick={e=>{alterarUsuario(usuario)}}>{usuario.nome}</td>
                                            <td onClick={e=>{alterarUsuario(usuario)}}>{usuario.email}</td>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <td>
                                                    <a className="close">
                                                        <span id="tabela-excluir" aria-hidden="true" onClick={e => {definirExclusao(usuario.id, usuario.id_telefone, usuario.id_endereco, usuario.id_controle_acesso)}}>x</span>
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
                            <h1>Informações Pessoais</h1>
                        </div>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                    </div>
                    <hr></hr>
                </div>

                <div className="formulario-padrao">
                    <label>Nome completo*</label>
                    <input type="text" name="nome" id="nome" value={nome || ""} placeholder="Digite o nome" onChange={e=>{setNome(e.target.value);document.querySelector("#msgNome").innerHTML = ""}} required />
                    <div className='msg' id='msgNome'></div>
                </div>

                <div className="formulario-padrao">
                    <label>CPF</label>
                    <input type="text" name="cpf" id="cpf" value={cpf  || ""} placeholder="xxx.xxx.xxx-xx" onChange={e=>{setCpf(e.target.value);document.querySelector("#msgCPF").innerHTML = ""}}/>
                    <div className='msg' id='msgCPF'></div>
                </div>

                <div className="formulario-padrao">
                    <label>Idade</label>
                    <input type="text" name="idade" id="idade" value={idade  || ""} placeholder="Digite a idade" onChange={e=>{setIdade(e.target.value);document.querySelector("#msgIdade").innerHTML = ""}} required />
                    <div className='msg' id='msgIdade'></div>
                </div>

                <div className='formulario-padrao-sexo'>
                    <label>Sexo</label>

                    <label id="fem">Feminino
                        <input type="radio" name="Sexo" id="SexoF" value="Feminino" onClick={definirF} onChange={e=>setSexo(e.target.value)}/>
                    </label>
    
                    <label id="mas">Masculino
                        <input type="radio" name="Sexo" id="SexoM" value="Masculino"  onClick={definirM} onChange={e=>setSexo(e.target.value)}/>
                    </label>
                </div>

                <div className="formulario-padrao">
                    <label>Email</label>
                    <input type="email" name="email" id="email" value={email  || ""} placeholder="exemplo@email.com" onChange={e=>{setEmail(e.target.value);document.querySelector("#msgEmail").innerHTML = ""}}/>
                    <div className='msg' id='msgEmail'></div>
                </div>

                <div className="mensagemCli"></div>

                <div className='formulario-padrao'>
                    {telefoneForm &&
                        <div className="formulario-telefone">
                            <h1>Cadastrar Contato*</h1>

                            <div className="formulario-padrao">
                                <label htmlFor="telefone">Número de contato (mínimo 1, máximo 3 telefones)</label>
                                <div id="adicionar-contato">
                                    <input id='cadTel' type="tel" value={telefone} onChange={e=>{setTelefone(e.target.value);document.querySelector("#mensagemContato").innerHTML = ""}} placeholder="(xx)xxxxx-xxxx" required/>
                                    <input id='addTel' type="button" onClick={addLista} value="Adicionar"/>                           
                                </div>
                                <div id="mensagemContato"></div>
                            </div>

                            {verContatos.length > 0 && <div id="div-tabela">
                                <table id="tabela-contato">
                                    <thead>
                                        <tr>
                                            <th>Telefones</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verContatos.map(contato => (
                                            <tr key={contato.codigo}>
                                                <td>{contato.telefone}</td>
                                                <td>
                                                    <button id="excTel" className="btnExcluirCont" onClick={()=>Excluir(contato.codigo)} type="button">
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>}
                        </div>
                    }
                </div>
                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                    <a id='botaoEndereco' onClick={e=>definirEnderecoOpen()}>Cadastrar Endereço (Opcional)</a>  
                </div>
            </div>

            {EnderecoOpen === true &&
                <div className="formulario">
                    <div className='titulo'>
                        <h1>Informações de Endereço</h1>
                        <hr></hr>
                    </div>
                    <div className="formulario-padrao">
                        <label htmlFor="cep">CEP</label>
                        <input type="text" name="cep" id="cep" value={cep || ""} placeholder="xxxxx-xxx" onChange={e=>{setCep(e.target.value);document.querySelector("#msgCep").innerHTML = ""}}/>
                        <div className='msg' id='msgCep'></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="cidade">Cidade</label>
                        <input type="text" name="cidade" id="cidade" value={cidade || ""} placeholder="Digite a cidade" onChange={e=>{setCidade(e.target.value);document.querySelector("#msgCidade").innerHTML = ""}}/>
                        <div className='msg' id='msgCidade'></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="rua">Rua</label>
                        <input type="text" name="rua" id="rua" value={rua || ""} placeholder="Digite a rua" onChange={e=>{setRua(e.target.value);document.querySelector("#msgRua").innerHTML = ""}}/>
                        <div className='msg' id='msgRua'></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="numero">Número</label>
                        <input type="number" name="numero" id="numero" value={numero || ""} placeholder="Digite o número" onChange={e=>{setNumero(e.target.value);document.querySelector("#msgNumero").innerHTML = ""}}/>
                        <div className='msg' id='msgNumero'></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="bairro">Bairro</label>
                        <input type="text" name="bairro" id="bairro" value={bairro || ""} placeholder="Digite o bairro" onChange={e=>{setBairro(e.target.value);document.querySelector("#msgBairro").innerHTML = ""}}/>
                        <div className='msg' id='msgBairro'></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="complemento">Complemento</label>
                        <input type="text" name="complemento" id="complemento" value={complemento || ""} placeholder="Digite o complemento" onChange={e=>{setComplemento(e.target.value);document.querySelector("#msgComplemento").innerHTML = ""}}/>
                        <div className='msg' id='msgComplemento'></div>
                    </div>
                </div>
            }
            <div className='formulario'>
                <div className='div-botoes'>
                    <button id='limpar' type="button" onClick={limpar}>Limpar</button>
                    <button id="btnForm" onClick={proximoUsuarioDados}>Proximo</button>
                </div>
            </div>
            </div>
            </>
            }

            {formDados === true &&
            <>
            <div className='background'>
            <div className='formulario'>
                <div className='titulo'>
                    <div className='titulo-flex'>
                        <div className='titulo-cont'>
                            <button id="retornar" onClick={e=>{setForm(true);setFormDados(false)}}><BsIcons.BsArrowLeft/></button>
                            <h1>Dados de Usuário</h1>
                        </div>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                    </div>
                    <hr></hr>
                </div>
                <div className='formulario-padrao'>
                    {cargos !== null &&
                        <>
                            <label>Cargo*</label>
                            <select id="selCargo" value={idCargo} onChange={e=>{setIdcargo(e.target.value);document.querySelector("#msgCargo").innerHTML = ""}}>
                                <option key={0} value={0}>Escolha um cargo</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.id} value={cargo.id}>{cargo.descricao}</option>
                                ))}
                            </select>
                            <div className='msg' id='msgCargo'></div>
                        </>
                    }
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="nivelAcesso">Nível Acesso*</label>
                    <select id='nivelAc' value={nivelAcesso} onChange={e=>{setNivelAcesso(e.target.value);document.querySelector("#msgNivel").innerHTML = ""}}>
                        <option>Escolha um nível de acesso</option>
                        <option key={20} value={20}>Funcionário</option>
                        <option key={60} value={60}>Administrador</option>
                    </select>
                    <div className='msg' id='msgNivel'></div>
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="salario">Salário*</label>
                    <input type="number" name="salario" id="salario" value={salario || ""} placeholder="Digite o Salário" onChange={e=>{setSalario(e.target.value);document.querySelector("#msgSalario").innerHTML = ""}}/>
                    <div className='msg' id='msgSalario'></div>
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="dataEmissao">Data Admissão*</label>
                    <input type="date" name="dataEmissao" id="dataEmissao" value={dataEmissao || ""} onChange={e=>{setDataEmissao(e.target.value);document.querySelector("#msgEmissao").innerHTML = ""}}/>
                    <div className='msg' id='msgEmissao'></div>
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="dataDemissao">Data Demissão</label>
                    <input type="date" name="dataDemissao" id="dataDemissao" value={dataDemissao} onChange={e=>{setDataDemissao(e.target.value);document.querySelector("#msgDemissao").innerHTML = ""}}/>
                    <div className='msg' id='msgDemissao'></div>
                </div>

                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>
            <div className='formulario'>
                <div className='div-botoes'>
                    <button id="limpar" type="button" onClick={limpar}>Limpar</button>
                    <button id="btnForm" onClick={proximoUsuarioAcesso}>Proximo</button>
                </div>
            </div>
            </div>
            </>
            }

            {formAcesso === true &&
            <>
            <div className='background'>
            <div className="formulario">
                <div className='titulo'>
                    <div className='titulo-flex'>
                        <div className='titulo-cont'>
                            <button id="retornar" onClick={e=>{setFormDados(true);setFormAcesso(false)}}><BsIcons.BsArrowLeft/></button>
                            <h1>Dados de Acesso</h1>
                        </div>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                    </div>
                    <hr></hr>
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="login">Login*</label>
                    <input type="text" name="login" id="login" value={login || ""} placeholder="Digite o nome de usuário" onChange={e=>{setLogin(e.target.value);document.querySelector("#msgLogin").innerHTML = ""}}/>
                    <div className='msg' id='msgLogin'></div>
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="senha">Senha*</label>
                    <input type="text" name="senha" id="senha" value={senha || ""} placeholder="Digite a senha" onChange={e=>{setSenha(e.target.value);document.querySelector("#msgSenha").innerHTML = ""}}/>
                    <div className='msg' id='msgSenha'></div>
                </div>

                <div className='titulo-bottom'>
                    <h2>( * ) Campos obrigatórios</h2>
                </div>
            </div>

            <div className='formulario'>
                <div className='div-botoes'>
                    <button id='limpar' type="button" onClick={limpar}>Limpar</button>
                    <button className={(salvando ? "disabled": "")} 
                        type="submit" id="btnForm" onClick={e=>{confirmarDados()}}>
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
                    <p id='msgSistema' style={{color: msgCor}}>{msg}</p>
                </div>    
            }

            {defExclusao === true &&
            <div id="id01" className="modal">
                <form className="modal-content">
                    <div className="container">
                        <h1>Deletar Usuário</h1>
                        <input type="button" id='manualButton' value="Manual" onClick={e=>{ativarManual(ultimoId)}}></input>
                        {msgProcurar > 0 &&
                            <p>Este usuário está presente em algumas vendas, não é possível deletar!!</p>                       
                        }           
                        {
                            msgProcurar <= 0 &&
                            <p>Usuário será deletado, deseja continuar?</p>
                        }

                        <div className="clearfix">
                            <button id='cancelar' type="button" className="cancelbtn" onClick={()=>cancelar()}>Cancelar</button>
                            {msgProcurar <= 0 &&
                                <button id='excluir' type="button" className="deletebtn" onClick={()=>excluirUsuario()}>Deletar</button>
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

/*
                   <input type="button" id='btnCargo' onClick={definirBotaoNovoCargo} value="Novo Cargo"/> 
                    {btnNovoCargo === true &&
                       <div className='formulario-padrao'>
                            <label>Cadastrar Novo Cargo</label>
                            <div className='adicionar-cargo'>
                                <input type="text" name="cargo" id="cargo" value={cadDescCargo || ""} onChange={e=>setCadDescCargo(e.target.value)} placeholder="Digite o cargo"/>
                                <input id='cadCargo' type="button" onClick={cadastrarCargo} value="Cadastrar"/> 
                                {msgCargo !== "" &&
                                    <p style={{color: cargoMsgCor}}>{msgCargo}</p>
                                }
                            </div>
                       </div>
                    }
*/