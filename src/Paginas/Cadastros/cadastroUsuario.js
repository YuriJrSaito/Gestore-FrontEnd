import './cadastroUsuario.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';

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

    const [isOpen, setIsOpen] = useState(true);
    const [button, setButton] = useState('Salvar');
    const [titulo, setTitulo] = useState('Cadastrar Usuário');
    const [EnderecoOpen, setEnderecoOpen] = useState(false);

    const [filtro, setFiltro] = useState('');
    const [usuarios, setUsuarios] = useState('');
    const [msg, setMsg] = useState('');

    const [altCA, setCA] = useState('');
    const [altEnd, setAltEnd] = useState('');
    const [altTel, setAltTel] = useState('');
    const [altUs, setAltUs] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [alterando, setAlterando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const [excAcesso, setExcAcesso] = useState('');
    const [excTel, setExcTel] = useState('');
    const [excEnd, setExcEnd] = useState('');
    const [excUs, setExcUs] = useState('');

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

    async function validarEmail(valor)
    {
        if(email === "")
            return true;
        var exp = /^[a-z0-9-_]+@[a-z0-9]+\.com/;
        if(exp.test(valor))
            return true;

        document.querySelector("#msgEmail").innerHTML = "<p>Email inválido</p>"
        return false;
    }

    async function validarCPF(valor)
    {
        var exp = /(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/;
        if(exp.test(valor))
            return true;

        document.querySelector("#msgCPF").innerHTML = "<p>CPF inválido</p>";
        return false;
    }

    async function formatarCPF()
    {
        var retorno = true;
        if(cpf !== "")
        {
            if(cpf.length > 11)
            {
                document.querySelector("#msgCPF").innerHTML = "<p>CPF inválido</p>";
                return false;
            }
            else
            {
                var val = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                retorno = await validarCPF(val);
            }

        }
        return retorno;
    }

    async function validarNome()
    {
        if(nome === "")
        {
            document.querySelector("#msgNome").innerHTML="<p>Digite um nome</p>"; 
            return false;
        }
        if(nome.length > 50)
        {
            document.querySelector("#msgNome").innerHTML="<p>Nome deve ter no máximo 50 caracteres</p>";
            return false;
        }
        return true;
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

    async function mascaraNumero(valor)
    {
        var exp = /^\d+$/;
        if(exp.test(parseInt(valor)))
            return true; 
        return false
    }

    async function validarNumero()
    {
        var retorno = true;
        if(numero !== "")
        {
            if(parseInt(numero) < 0)
            {
                document.querySelector("#msgNumero").innerHTML = "<p>Número inválida</p>";
                retorno = false;
            }
            if(await mascaraNumero(numero) === false)
            {
                document.querySelector("#msgNumero").innerHTML = "<p>Digite apenas Números</p>";
                retorno = false;
            }
        }   
        return retorno;
    }

    async function validarIdade()
    {
        var retorno = true;
        if(idade !== "")
        {
            if(parseInt(idade) < 13 || parseInt(idade)>100)
            {
                document.querySelector("#msgIdade").innerHTML = "<p>Idade inválida</p>";
                retorno = false;
            }
            if(await mascaraNumero(idade) === false)
            {
                document.querySelector("#msgIdade").innerHTML = "<p>Digite apenas Números</p>";
                retorno = false;
            }
        }

        return retorno;
    }

    async function formatarCep()
    {
        console.log(cep);
        var retorno = true;
        if(cep !== "")
        {
            var exp = /^\d+$/;
            if(exp.test(parseInt(cep)))
            {
                var val = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
                setCep(val);
                retorno = await validarCep(val);
            }
            else
            {
                document.querySelector("#msgCep").innerHTML = "<p>Digite apenas Números</p>";
                return false;
            }
        }
        return retorno;
    }

    async function validarCep(valor)
    {
        var exp = /(\d{5})-(\d{3})/;
        if(exp.test(valor))
            return true;

        document.querySelector("#msgCep").innerHTML = "<p>CEP inválido</p>";
        return false;
    }

    async function validarComplemento()
    {
        if(complemento !== "")
        {
            if(complemento.length > 30)
            {
                document.querySelector("#msgComplemento").innerHTML = "<p>Complemento deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }   

    async function validarCidade()
    {
        if(cidade !== "")
        {
            if(cidade.length > 30)
            {
                document.querySelector("#msgCidade").innerHTML = "<p>Cidade deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async function validarBairro()
    {
        if(bairro !== "")
        {
            if(bairro.length > 30)
            {
                document.querySelector("#msgBairro").innerHTML = "<p>Bairro deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async function validarRua()
    {
        if(rua !== "")
        {
            if(rua.length > 50)
            {
                document.querySelector("#msgRua").innerHTML = "<p>Rua deve ter no máximo 50 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async function validarCargo()
    {
        if(idCargo === '')
        {
            document.querySelector("#msgCargo").innerHTML = "<p>Selecione um cargo</p>";
            return false;
        }
        
        return true;
    }

    async function validarNivel()
    {
        if(nivelAcesso === 0)
        {
            document.querySelector("#msgNivel").innerHTML = "<p>Selecione um nível</p>";
            return false;
        }
        return true;
    }

    async function validarSalario()
    {
        if(salario === "")    
        {
            document.querySelector("#msgSalario").innerHTML = "<p>Digite um salário</p>";
            return false;
        }
        return true;
    }

    async function validarDataEmissao()
    {
        if(dataEmissao === "")
        {
            document.querySelector("#msgEmissao").innerHTML = "<p>Selecione a data de emissão</p>";
            return false;
        }
        return true;
    }

    async function validarDataDemissao()
    {
        if(dataDemissao !== "")
        {
            if(dataDemissao < dataEmissao)
            {
                document.querySelector("#msgDemissao").innerHTML = "<p>Data de demissão deve ser maior que Data de emissão</p>";
                return false;
            }
        }
        return true;
    }

    async function delEndereco(idEndereco)
    {
        if(idEndereco !== null && idEndereco !== "")
        {

            await api.delete(`/deletarEndereco/${idEndereco}`)
            .then((response)=>{
                console.log(response.data);
            })
        }
    }

    async function delTelefone(idTelefone)
    {
        if(idTelefone !== null && idTelefone !== "")
        {
            await api.delete(`/deletarTelefone/${idTelefone}`)
            .then((response)=>{
                console.log(response.data);
            })
        }
    }

    async function delUsuario(idUSuario)
    {
        if(idUSuario !== "" && idUSuario !== null)
        {
            await api.delete(`/deletarUsuario/${idUSuario}`)
            .then((response)=>{
                setMsg(response.data);
            })
        }   
    }

    async function delAcesso(idCA)
    {
        if(idCA !== "" && idCA !== null)
        {
            await api.delete(`/deletarAcesso/${idCA}`)
            .then((response)=>{
                setMsg(response.data);
                console.log(response.data, "controle acesso deletado");
            })
        }   
    }

    async function excluirUsuario()
    {
        //procurar relações de usuarios em funções fundamentais posteriormente
        if(excluindo === false)
        {
            setExcluindo(true);
            await delEndereco(excEnd);
            await delTelefone(excTel);
            await delUsuario(excUs);
            await delAcesso(excAcesso);

            await carregarUsuarios();

            document.getElementById('id01').style.display='none';
            setExcluindo(false);
        }
    }

    async function definirExclusao(idUsuario, idTelefone, idEndereco, idCA)
    {
        document.getElementById('id01').style.display='block';
        setExcAcesso(idCA);
        setExcTel(idTelefone);
        setExcEnd(idEndereco);
        setExcUs(idUsuario);
    }

    async function validarLogin()
    {
        if(login === "")
        {
            document.querySelector("#msgLogin").innerHTML = "<p>Digite o login</p>";
            return false;
        }
        return true;
    }

    async function validarSenha()
    {
        if(senha === "")
        {
            document.querySelector("#msgSenha").innerHTML = "<p>Digite a senha</p>";
            return false;
        }
        return true;
    }

    async function validar()
    {
        let validar;

        validar = await validarNome();
        if(!validar)
            return false;

        validar = await validarEmail(email);
        if(!validar)
            return false;
        
        validar = await formatarCPF(cpf);
        if(!validar)
            return false;
            
        validar = await validarTelefoneExiste();
        if(!validar)
            return false;

        validar = await validarIdade();
        if(!validar)
            return false;

        validar = await formatarCep(cep);
        if(!validar)
            return false;

        validar = await validarNumero();
        if(!validar)
            return false;
        
        validar = await validarComplemento();
        if(!validar)
            return false;

        validar = await validarCidade();
        if(!validar)
            return false;
            
        validar = await validarBairro();
        if(!validar)
            return false;

        validar = await validarRua();
        if(!validar)
            return false;

        validar = await validarCargo();
        if(!validar)
            return false;

        validar = await validarNivel();
        if(!validar)
            return false;

        validar = await validarSalario();
        if(!validar)
            return false;

        validar = await validarDataEmissao();
        if(!validar)
            return false;

        validar = await validarDataDemissao();
        if(!validar)
            return false;

        validar = await validarLogin();
        if(!validar)
            return false;

        validar = await validarSenha();
        if(!validar)
            return false;

        return true;
    }    

    function limparAvisos()
    {
        document.querySelector("#msgNome").innerHTML = "";
        document.querySelector("#msgCPF").innerHTML = "";
        document.querySelector("#msgIdade").innerHTML = "";
        document.querySelector("#msgEmail").innerHTML = "";
        document.querySelector("#mensagemContato").innerHTML = "";

        if(EnderecoOpen == true)
        {
            document.querySelector("#msgCep").innerHTML = "";
            document.querySelector("#msgCidade").innerHTML = "";
            document.querySelector("#msgRua").innerHTML = "";
            document.querySelector("#msgNumero").innerHTML = "";
            document.querySelector("#msgBairro").innerHTML = "";
            document.querySelector("#msgComplemento").innerHTML = "";
        }

        document.querySelector("#msgCargo").innerHTML = "";
        document.querySelector("#msgNivel").innerHTML = "";
        document.querySelector("#msgSalario").innerHTML = "";
        document.querySelector("#msgEmissao").innerHTML = "";
        document.querySelector("#msgDemissao").innerHTML = "";
        document.querySelector("#msgLogin").innerHTML = "";
        document.querySelector("#msgSenha").innerHTML = "";
    }

    async function limpar()
    {
        setSalvando(false);
        setAlterando(false);
        setExcluindo(false);
        setButton("Salvar");

        setMsg('');

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

        document.querySelector("#SexoF").checked = false;
        document.querySelector("#SexoM").checked = false;

        limparAvisos();
    }

    async function confirmarDados(e)
    {
        e.preventDefault();
        if(salvando === false)
        {
            setSalvando(true);

            var dataD = dataDemissao;
            if(dataDemissao === undefined)
                dataD = null;

            if(await validar())
            {
                if(button === "Salvar")
                {
                    await api.post('/cadUsuario',{
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
                            setMsg(response.data);
                        }
                    )
                }
                else
                {
                    await api.put('/altUsuario',{
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
                            setMsg(response.data); 
                        }
                    )
                }
                await carregarTudo();
                await limpar();
            }
            setSalvando(false);
        }
    }

    async function cadastrarCargo()
    {
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

    async function carregarTudo()
    {
        await carregarUsuarios();
        await carregarCargos();
    }

    async function carregarUsuarios()
    {
        await api.get('/listarTodosUsuarios')
        .then((response)=>{
            setUsuarios(response.data);
        });
    }

    async function carregarCargos()
    {
        await api.get('/buscarCargos').then((resp)=>{
            setCargos(resp.data);
        });
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
        if(filtro !== "")
        {
            await api.get(`/filtrarUsuarios/${filtro}`)
            .then((response)=>{
                setUsuarios(response.data);
            })   
        }
        else
        {
            await api.get('/listarTodosUsuarios')
            .then((response)=>{
                setUsuarios(response.data);
            });
        }        
    }

    async function alterarUsuario(usuario)
    {
        if(alterando === false)
        {
            setAlterando(true);
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

            await api.get(`/buscarEndereco/${usuario.id_endereco}`)
            .then((response)=>{
                if(response.data[0].cep === null)
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
            })   

            await api.get(`/buscarTelefones/${usuario.id_telefone}`)
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

            await api.get(`/buscarControleAcesso/${usuario.id_controle_acesso}`)
            .then((response)=>{
                setLogin(response.data[0].login);
                setSenha(response.data[0].senha);
                setNivelAcesso(response.data[0].nivel_acesso);
            })  

            await api.get(`/buscarCargo/${usuario.id_cargo}`)
            .then((response)=>{
                setIdcargo(response.data[0].id);
            })  

            setButton("Alterar");
            setAlterando(false);
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

    async function definirEnderecoOpen()
    {
        if(EnderecoOpen === false)
            setEnderecoOpen(true);
        else
            setEnderecoOpen(false);
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
                            <h1>Informações Pessoais</h1>
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

                            <label>Feminino
                                <input type="radio" name="Sexo" id="SexoF" value="Feminino" onClick={definirF} onChange={e=>setSexo(e.target.value)}/>
                            </label>
            
                            <label>Masculino
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
                            {isOpen &&
                                <div className="formulario-telefone">
                                    <h1>Cadastrar Contato*</h1>

                                    <div className="formulario-padrao">
                                        <label htmlFor="telefone">Número de contato (mínimo 1, máximo 3 telefones)</label>
                                        <div id="adicionar-contato">
                                            <input type="tel" value={telefone} onChange={e=>{setTelefone(e.target.value);document.querySelector("#mensagemContato").innerHTML = ""}} placeholder="(xx)xxxxx-xxxx" required/>
                                            <input type="button" onClick={addLista} value="Adicionar"/>                           
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
                                                            <button className="btnExcluirCont" onClick={()=>Excluir(contato.codigo)} type="button">
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

                    <div className="formulario-tabela-usuarios">
                        <div className='titulo'>
                            <h1>Usuarios Cadastrados</h1>
                        </div>
                        <div className='formulario-padrao-tabela-usuarios'>
                            <div className='inputs-buscar-usuarios'>
                                <input type="search" placeholder='Pesquisar por Nome' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                                <button onClick={filtrarUsuarios}>OK</button>   
                            </div> 

                            <div className='div-tabela-usuario'>
                                <table className='tabela-usuario'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <th>Ação</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios !== "" &&
                                            usuarios.map(usuario =>(
                                                <tr key={usuario.id} id="alterando">
                                                    <td onClick={e=>alterarUsuario(usuario)}>{usuario.nome}</td>
                                                    <td onClick={e=>alterarUsuario(usuario)}>{usuario.email}</td>
                                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                                        <td>
                                                            <button type="button" id='deletando' onClick={e => {definirExclusao(usuario.id, usuario.id_telefone, usuario.id_endereco, usuario.id_controle_acesso)}}>
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

            {EnderecoOpen === true &&
                <div className="formulario">
                    <div className='titulo'>
                        <h1>Informações de Endereço</h1>
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
                <div className='titulo'>
                    <h1>Dados do Usuário</h1>
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
                    <input type="button" id='btnCargo' onClick={definirBotaoNovoCargo} value="Novo Cargo"/> 
                    {btnNovoCargo === true &&
                       <div className='formulario-padrao'>
                            <label>Cadastrar Novo Cargo</label>
                            <div className='adicionar-cargo'>
                                <input type="text" name="cargo" id="cargo" value={cadDescCargo || ""} onChange={e=>setCadDescCargo(e.target.value)} placeholder="Digite o cargo"/>
                                <input type="button" onClick={cadastrarCargo} value="Cadastrar"/> 
                                {msgCargo !== "" &&
                                    <p style={{color: cargoMsgCor}}>{msgCargo}</p>
                                }
                            </div>
                       </div>
                    }
                </div>

                <div className="formulario-padrao">
                    <label htmlFor="nivelAcesso">Nível Acesso*</label>
                    <select value={nivelAcesso} onChange={e=>{setNivelAcesso(e.target.value);document.querySelector("#msgNivel").innerHTML = ""}}>
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
                    <label htmlFor="dataEmissao">Data Emissão*</label>
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

            <div className="formulario">
                <div className='titulo'>
                    <h1>Dados de Acesso</h1>
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
                        <h1>Deletar Usuário</h1>
                        <p>Telefone e Endereço serão deletados juntamente com o Usuário deseja continuar?</p>

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => document.getElementById('id01').style.display='none'}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirUsuario()}>Deletar</button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;