import './cadastroCliente.css';
import '../../App.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import Validar from '../../servicos/validar';

function Formulario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState('');
    const [cpf, setCpf] = useState('');
    const [sexo, setSexo] = useState('');

    const [bairro, setBairro] = useState('');
    const [rua, setRua] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [EnderecoOpen, setEnderecoOpen] = useState(false);

    const [verContatos, setContatos] = useState([]);
    const [telefone, setTelefone] = useState([]);

    const [isOpen, setIsOpen] = useState(true);
    const [button, setButton] = useState('Salvar');
    const [titulo, setTitulo] = useState('Cadastrar Cliente');
    const [salvando, setSalvando] = useState(false);
    const [requisicao, setRequisicao] = useState(false); 

    const [msg, setMsg] = useState('');

    const [filtro, setFiltro] = useState('');
    const [clientes, setClientes] = useState('');

    const [altTel, setAltTel] = useState('');
    const [altEnd, setAltEnd] = useState('');
    const [altCli, setAltCli] = useState('');

    const [excTel, setExcTel] = useState('');
    const [excEnd, setExcEnd] = useState('');
    const [excCli, setExcCli] = useState('');

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

    async function validarTelefoneExiste()
    {
        if(verContatos.length === 0)
        {
            document.querySelector("#mensagemContato").innerHTML = "<p>Insira pelo menos 1 Telefone</p>";
            return false;
        }

        return true;
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

    function limparAvisos()
    {
        document.querySelector("#SexoF").checked = false;
        document.querySelector("#SexoM").checked = false;

        document.querySelector("#msgNome").innerHTML = "";
        document.querySelector("#msgCPF").innerHTML = "";
        document.querySelector("#msgIdade").innerHTML = "";
        document.querySelector("#msgEmail").innerHTML = "";
        document.querySelector("#mensagemContato").innerHTML = "";

        if(EnderecoOpen === true)
        {
            document.querySelector("#msgCep").innerHTML = "";
            document.querySelector("#msgCidade").innerHTML = "";
            document.querySelector("#msgRua").innerHTML = "";
            document.querySelector("#msgNumero").innerHTML = "";
            document.querySelector("#msgBairro").innerHTML = "";
            document.querySelector("#msgComplemento").innerHTML = "";
        }
    }

    async function limpar()
    {
        setSalvando(false);
        setRequisicao(false);
        
        setButton("Salvar");

        setNome('');
        setEmail('');
        setIdade('');
        setCpf('');
        setMsg('');

        setBairro('');
        setRua('');
        setCidade('');
        setCep('');
        setNumero('');
        setComplemento(''); 
            
        setAltTel('');
        setAltEnd('');
        setAltCli('');

        setContatos([]);
        setTelefone('');

        document.querySelector("#SexoF").checked = false;
        document.querySelector("#SexoM").checked = false;
        
        limparAvisos();
    }

    async function confirmarDados(e)
    {
        e.preventDefault();
        setMsg('');
        if(requisicao === false)
        {
            setRequisicao(true);
            if(await validar())
            {
                setSalvando(true);
                if(button === "Salvar")
                {
                    await api.post('/cadCliente',{
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
                        complemento: complemento
                    }).then(
                        response => {
                            setMsg(response.data);
                        }
                    )
                }
                else
                {
                    await api.put('/altCliente',{
                        idCliente: altCli,
                        nome: nome,
                        email: email,
                        idade: idade,
                        sexo: sexo,
                        cpf: cpf,
                        idTelefone: altTel,
                        telefones: verContatos,
                        idEndereco: altEnd,
                        cep: cep,
                        cidade: cidade,
                        rua: rua,
                        bairro: bairro,
                        numero: numero,
                        complemento: complemento
                    }).then(
                        response => {
                            setMsg(response.data); 
                        }
                    )
                }
                await carregarTodosClientes();
                await limpar();
                setSalvando(false);
            }
            setRequisicao(false);
        }
    }

    useEffect(()=>{
        carregarTodosClientes();
    },[]);

    async function carregarTodosClientes()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get('/listarTodosClientes')
            .then((response)=>{
                setClientes(response.data);
            });
            setRequisicao(false);
        }
    }

    async function filtrarClientes()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            if(filtro !== "")
            {
                await api.get(`/filtrarClientes/${filtro}`)
                .then((response)=>{
                    setClientes(response.data);
                })   
            }
            else
            {
                await carregarTodosClientes();
            }
            setRequisicao(false);
        }
    }

    async function delEndereco(idEndereco)
    {
        if(idEndereco !== null && idEndereco !== "")
        {
            if(requisicao === false)
            {
                setRequisicao(true);
                await api.delete(`/deletarEndereco/${idEndereco}`)
                .then((response)=>{
                    console.log(response.data);
                })
                setRequisicao(false);
            }
        }
    }

    async function delTelefone(idTelefone)
    {
        if(idTelefone !== null && idTelefone !== "")
        {
            if(requisicao === false)
            {
                setRequisicao(true);
                await api.delete(`/deletarTelefone/${idTelefone}`)
                .then((response)=>{
                    console.log(response.data);
                })
                setRequisicao(false);
            }
        }
    }

    async function delCliente(idCliente)
    {
        if(idCliente !== "" && idCliente !== null)
        {
            if(requisicao === false)
            {
                setRequisicao(true);
                await api.delete(`/deletarCliente/${idCliente}`)
                .then((response)=>{
                    setMsg(response.data);
                })
                setRequisicao(false);
            }
        }   
    }

    async function excluirCliente()
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await delEndereco(excEnd);
            await delTelefone(excTel);
            await delCliente(excCli);
            await carregarTodosClientes();

            document.getElementById('id01').style.display='none';
            setRequisicao(false);
        }
    }

    async function definirExclusao(idCliente, idTelefone, idEndereco)
    {
        document.getElementById('id01').style.display ='block';
        setExcTel(idTelefone);
        setExcEnd(idEndereco);
        setExcCli(idCliente);
    }

    async function carregarTelefones(cliente)
    {
        if(requisicao === false)
        {
            setRequisicao(true);
            await api.get(`/buscarTelefones/${cliente.id_telefone}`)
            .then((response)=>{
                var telefonesVet = [response.data[0].telefone1, response.data[0].telefone2, response.data[0].telefone3];
                var vet2 = [];
                for(var x=0; x<telefonesVet.length; x++)
                {
                    if(telefonesVet[x] != null)
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
            setRequisicao(false);
        }
    }

    async function alterarCliente(cliente)
    {   
        if(requisicao === false)
        {
            limpar();
            setRequisicao(true);

            verContatos.length = 0;
            /*if(cliente.cpf != "")
            {
                var val = cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                console.log(val);
                setCpf(val);
            }
            else*/
            setCpf(cliente.cpf);

            if(cliente.idade === null)
                setIdade('');
            else
                setIdade(cliente.idade);

            setNome(cliente.nome);
            setEmail(cliente.email);
            setAltEnd(cliente.id_endereco);
            setAltTel(cliente.id_telefone);
            setAltCli(cliente.id);
            setSexo(cliente.sexo);

            if(cliente.sexo === "Masculino")
                definirM();
            else
                if(cliente.sexo === "Feminino")
                    definirF(); 

            if(EnderecoOpen === true)
            {
                await definirEnderecoOpen();
            }
            await carregarTelefones(cliente);

            setRequisicao(false);
            setButton("Alterar");
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
            if(requisicao === false)
            {
                setRequisicao(true);

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
                setRequisicao(false);
            }
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
                            <h1>Informações Pessoais</h1>
                        </div>

                        <div className="formulario-padrao">
                            <label>Nome completo*</label>
                            <input type="text" name="nome" id="nome" value={nome || ""} placeholder="Digite o nome" onChange={e=>{setNome(e.target.value);document.querySelector("#msgNome").innerHTML = ""}} required />
                            <div className='msg' id="msgNome"></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>CPF</label>
                            <input type="text" name="cpf" id="cpf" value={cpf || ""} placeholder="xxx.xxx.xxx-xx" onChange={e=>{setCpf(e.target.value);document.querySelector("#msgCPF").innerHTML = ""}}/>
                            <div className='msg' id="msgCPF"></div>
                        </div>

                        <div className="formulario-padrao">
                            <label>Idade</label>
                            <input type="text" name="idade" id="idade" value={idade || ""} placeholder="Digite a idade" onChange={e=>{setIdade(e.target.value);document.querySelector("#msgIdade").innerHTML = ""}} required />
                            <div className='msg' id='msgIdade'></div>
                        </div>

                        <div className='formulario-padrao-sexo'>
                            <label>Sexo</label>

                            <label>Feminino
                                <input type="radio" name="SexoF" id="SexoF" value="Feminino" onClick={definirF} onChange={e=>setSexo(e.target.value)}/>
                            </label>
            
                            <label>Masculino
                                <input type="radio" name="SexoM" id="SexoM" value="Masculino"  onClick={definirM} onChange={e=>setSexo(e.target.value)}/>
                            </label>
                        </div>

                        <div className="formulario-padrao">
                            <label>Email</label>
                            <input type="text" name="email" id="email" value={email || ""} placeholder="exemplo@email.com" onChange={e=>{setEmail(e.target.value); document.querySelector("#msgEmail").innerHTML = ""}}/>
                            <div className='mensagem' id="mensagemEmail"></div>
                            <div className='msg' id="msgEmail"></div>
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
                    <div className="formulario-tabela-clientes">
                        <div className='titulo'>
                            <h1>Clientes Cadastrados</h1>
                        </div>
                        <div className='formulario-padrao-tabela-clientes'>
                            <div className='inputs-buscar-clientes'>
                                <input type="search" placeholder='Pesquisar por Nome' value={filtro} onChange={e=>setFiltro(e.target.value)}></input>
                                <button onClick={filtrarClientes}>OK</button>   
                            </div> 

                            <div className='div-tabela-cliente'>
                                <table className='tabela-cliente'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            {localStorage.getItem("nivelAcesso") >= 60 &&
                                                <th>Ação</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes !== "" &&
                                            clientes.map(cliente =>(
                                                <tr key={cliente.id} id="alterando">
                                                    <td onClick={e=>alterarCliente(cliente)}>{cliente.nome}</td>
                                                    <td onClick={e=>alterarCliente(cliente)}>{cliente.cpf}</td>
                                                    {localStorage.getItem("nivelAcesso") >= 60 &&
                                                        <td>
                                                            <button type="button" id='deletando' onClick={e => {definirExclusao(cliente.id, cliente.id_telefone, cliente.id_endereco)}}>
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
                        <input type="text" name="cep" id="cep" placeholder="xxxxx-xxx" value={cep || ""} onChange={e=>{setCep(e.target.value);document.querySelector("#msgCep").innerHTML = ""}}/>
                        <div className='msg' id="msgCep"></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="cidade">Cidade</label>
                        <input type="text" name="cidade" id="cidade" value={cidade || ""} placeholder="Digite a cidade" onChange={e=>{setCidade(e.target.value); document.querySelector("#msgCidade").innerHTML = ""}}/>
                        <div className='msg' id="msgCidade"></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="rua">Rua</label>
                        <input type="text" name="rua" id="rua" value={rua || ""} placeholder="Digite a rua" onChange={e=>{setRua(e.target.value);document.querySelector("#msgRua").innerHTML = ""}}/>
                        <div className='msg' id="msgRua"></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="numero">Número</label>
                        <input type="text" name="numero" id="numero" value={numero || ""} placeholder="Digite o número" onChange={e=>{setNumero(e.target.value);document.querySelector("#msgNumero").innerHTML = ""}}/>
                        <div className='msg' id="msgNumero"></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="bairro">Bairro</label>
                        <input type="text" name="bairro" id="bairro" value={bairro || ""} placeholder="Digite o bairro" onChange={e=>{setBairro(e.target.value);document.querySelector("#msgBairro").innerHTML = ""}}/>
                        <div className='msg' id="msgBairro"></div>
                    </div>

                    <div className="formulario-padrao">
                        <label htmlFor="complemento">Complemento</label>
                        <input type="text" name="complemento" id="complemento" value={complemento || ""} placeholder="Digite o complemento" onChange={e=>{setComplemento(e.target.value);document.querySelector("#msgComplemento").innerHTML = ""}}/>
                        <div className='msg' id="msgComplemento"></div>
                    </div>
                </div>
            }

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
                        <h1>Deletar Cliente</h1>
                        <p>Telefone e Endereço serão deletados juntamente com o Cliente deseja continuar?</p>

                        <div className="clearfix">
                            <button type="button" className="cancelbtn" onClick={e => document.getElementById('id01').style.display='none'}>Cancelar</button>
                            <button type="button" className="deletebtn" onClick={()=>excluirCliente()}>Deletar</button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Formulario;