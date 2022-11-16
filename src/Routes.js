import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import history from './servicos/history.js';
import Home from './Paginas/Home/Home.js';
import CadastroCliente from './Paginas/Cadastros/cadastroCliente.js';
import CadastroUsuario from './Paginas/Cadastros/cadastroUsuario.js';
import CadastroProduto from './Paginas/Cadastros/cadastroProduto.js';
import Login from './Paginas/Login/Login.js';
import Fornecedor from './Paginas/Cadastros/cadastroFornecedor.js';
import Venda from './Paginas/fundamentais/RealizarVenda.js';
import VendaCondicional from './Paginas/fundamentais/RealizarVendaCondicional.js';
import DevolverCondicional from './Paginas/fundamentais/DevolverCondicional.js';
import ContaPagar from './Paginas/fundamentais/ContaPagar.js';
import CadastrarCargo from './Paginas/Cadastros/cadastroCargo.js';
import CadastrarCategoria from './Paginas/Cadastros/cadastroCategoria.js';
import ContaReceber from './Paginas/fundamentais/contaReceber.js';
import Relatorio from './Paginas/Relatorios/Principal';


/*const cUsuario = (user) => {
    if(user == 60)
        return <CadastroUsuario/>;
    else
        return <Navigate to="/home" replace />;
};*/

const protectedRouteADM = (user, destino) =>{
    if(user < 60)
        return <Navigate to="/home" replace/>;
    return destino;
}

const protectedRouteAutenticado = (user, destino) =>{
    if(user == undefined || user == "")
        return <Navigate to="/" replace/>;
    return destino;
}

const App = () => {
    return (
        <>
            <Router>
                <Routes history={history}>
                    <Route path="/" element={<Login />} exact={true}></Route>
                    <Route path="/home" element={<Home />} exact={true}></Route>
                    <Route path="/cadastroCliente" element={<CadastroCliente />} exact={true}></Route>
                    <Route path="/cadastroProduto" element={<CadastroProduto />} exact={true}></Route>
                    <Route path="/cadastroUsuario" element={<CadastroUsuario/>} exact={true}></Route>
                    <Route path="/cadastroFornecedor" element={<Fornecedor />} exact={true}></Route>      
                    <Route path="/realizarVenda" element={<Venda />} exact={true}></Route>      
                    <Route path="/realizarVendaCondicional" element={<VendaCondicional />} exact={true}></Route>      
                    <Route path="/devolverCondicional" element={<DevolverCondicional />} exact={true}></Route>      
                    <Route path="/contaPagar" element={<ContaPagar />} exact={true}></Route>      
                    <Route path="/cadastroCargo" element={<CadastrarCargo />} exact={true}></Route>      
                    <Route path="/cadastroCategoria" element={<CadastrarCategoria />} exact={true}></Route>      
                    <Route path="/contaReceber" element={<ContaReceber />} exact={true}></Route>      
                    <Route path="/principalRelatorios" element={<Relatorio />} exact={true}></Route>      
                </Routes>
            </Router>
        </>
    );
}

/*<Router>
    <Routes history={history}>
        <Route path="/" element={<Login />} exact={true}></Route>
        <Route path="/home" element={protectedRouteAutenticado(localStorage.getItem('login'), <Home />)} exact={true}></Route>
        <Route path="/cadastroCliente" element={protectedRouteAutenticado(localStorage.getItem('login'), <CadastroCliente />)} exact={true}></Route>
        <Route path="/cadastroProduto" element={protectedRouteAutenticado(localStorage.getItem('login'), <CadastroProduto />)} exact={true}></Route>
        <Route path="/cadastroUsuario" element={protectedRouteADM(localStorage.getItem('nivelAcesso'), <CadastroUsuario/>)} exact={true}></Route>
        <Route path="/cadastroFornecedor" element={protectedRouteADM(localStorage.getItem('nivelAcesso'), <Fornecedor />)} exact={true}></Route>      
        <Route path="/realizarVenda" element={protectedRouteAutenticado(localStorage.getItem('login'), <Venda />)} exact={true}></Route>      
        <Route path="/realizarVendaCondicional" element={protectedRouteAutenticado(localStorage.getItem('login'), <VendaCondicional />)} exact={true}></Route>      
        <Route path="/devolverCondicional" element={protectedRouteAutenticado(localStorage.getItem('login'), <DevolverCondicional />)} exact={true}></Route>      
        <Route path="/contaPagar" element={protectedRouteADM(localStorage.getItem('nivelAcesso'),<ContaPagar />)} exact={true}></Route>      
        <Route path="/cadastroCargo" element={protectedRouteADM(localStorage.getItem('nivelAcesso'), <CadastrarCargo />)} exact={true}></Route>      
        <Route path="/cadastroCategoria" element={protectedRouteAutenticado(localStorage.getItem('login'), <CadastrarCategoria />)} exact={true}></Route>      
        <Route path="/contaReceber" element={protectedRouteAutenticado(localStorage.getItem('login'), <ContaReceber />)} exact={true}></Route>      
        <Route path="/principalRelatorios" element={protectedRouteADM(localStorage.getItem('nivelAcesso'),<Relatorio />)} exact={true}></Route>        
    </Routes>
</Router>*/


export default App;
