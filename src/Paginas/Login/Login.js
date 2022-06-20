import React, { useState } from 'react';
import api from '../../servicos/axiosAPI.js';
import history from '../../servicos/history.js';
import "./Login.css";

function Login(){
    const [login,setLogin] = useState('');
    const [senha,setSenha] = useState('');
    
    const validarUsuario = async () => {
      const response = await api.get(`/logar/${login}/${senha}`);
      return response.data;
    }

    async function logar(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";

        if(login.length>0 && senha.length>0)
        {
          var res=await validarUsuario();
          if(res.usuario_ativo === true && res !== undefined && res !== []){
              localStorage.setItem('login',res.login);
              localStorage.setItem('nivelAcesso',res.nivel_acesso);
              history.push("/home");
              window.location.reload();
          }
          else
              mensagem.innerHTML = 'Email e/ou senha incorretos';
        }
        else
          mensagem.innerHTML = 'Dados vazios';
    }

    return (
      <div id='login' className="background-login">
        <div className='formulario-login'>
          <div className='titulo-login'>
            <h1>GESTORE</h1>
          </div>
          <div className='titulo2'>
            <h1>LOGIN</h1>
          </div>
          <div className="formulario-padrao-login">
            <label>Login</label>
            <input type="text" name="login" id="login" value={login  || ""} onChange={e=>setLogin(e.target.value)} required />
          </div>
          <div className="formulario-padrao-login">
            <label>Senha</label>
            <input type="password" name="senha" id="senha" value={senha  || ""} onChange={e=>setSenha(e.target.value)} required />
          </div>
          <div id="mensagem">
          </div>
          <div className='div-botoes'>
            <button type="button" onClick={logar}>Acessar</button>
          </div>
        </div>
      </div>
    );
}
export default Login;