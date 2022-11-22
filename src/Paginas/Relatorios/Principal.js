import '../../App.css';
import './relatorio.css';
import api from '../../servicos/axiosAPI';
import Header from '../../Components/Header.js'
import React, { useEffect, useState } from 'react';
import GerarRelatorio from './GerarRelatorio';
import moment from 'moment/moment';

function Relatorio() {

    const [data, setData] = useState(moment().format('DD-MM-YYYY'));

    async function gerarRelatorioCliente()
    {
        let header = ['ID', 'Cliente', 'CPF', 'Telefone', 'Quantidade de Compras', 'Valor Gasto(R$)', 'A Pagar(R$)'];
        let clientes = await carregarClientes();

        GerarRelatorio(clientes, "Clientes", header.length, header, data);
    }

    async function carregarClientes()
    {
        let resp = await api.get('/relTodosClientes')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioVenda()
    {
        let header = ['ID', 'Funcionário', 'Cliente', 'Data da venda', 'Quantidade de parcelas', 
        'Quantidade de parcelas não pagas', 'Valor Total(R$)', 'Valor Total(R$) não pago'];

        let vendas = await carregarVendas();
        GerarRelatorio(vendas, "Vendas", header.length, header, data);
    }

    async function carregarVendas()
    {
        let resp = await api.get('/relTodasVendas')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioContaReceber()
    {
        let header = ['ID', 'Cliente', 'Data Da Venda', 'Valor Total(R$)', 'Valor não pago', 'Parcelas', 'Parcelas Não Pagas'];

        let contas = await carregarContasReceber();
        GerarRelatorio(contas, "Contas a Receber", header.length, header, data);
    }

    async function carregarContasReceber()
    {
        let resp = await api.get('/relTodasContasReceber')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioContaPagar()
    {
        let header = ['ID', 'Fornecedor', 'Título', 'Data Cadastrada', 'Valor Total(R$)', 'Valor não pago', 
                    'Parcelas', 'Parcelas Não Pagas'];

        let contas = await carregarContasPagar();
        GerarRelatorio(contas, "Contas a Pagar", header.length, header, data);
    }

    async function carregarContasPagar()
    {
        let resp = await api.get('/relTodasContasPagar')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioEstoque()
    {
        let header = ['ID', 'Código', 'Título', 'Quantidade No Estoque', 'Valor Unitário(R$)', 
        'Valor De Compra(R$)', 'Categoria', 'Fornecedor'];

        let estoque = await carregarEstoque();
        GerarRelatorio(estoque, "Estoque", header.length, header, data);
    }

    async function carregarEstoque()
    {
        let resp = await api.get('/relEstoque')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioCategoriaMaisVendidos()
    {
        let header = ['ID', 'Categoria', 'Quantidade Vendido', 'Valor(R$)'];

        let categorias = await carregarCategoriasMaisVendidas();
        GerarRelatorio(categorias, "20 Categorias De Produtos Mais Vendidas", header.length, header, data);
    }

    async function carregarCategoriasMaisVendidas()
    {
        let resp = await api.get('/relCategoriasMaisVendidas')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioCategoriaMenosVendidos()
    {
        let header = ['ID', 'Categoria', 'Quantidade Vendido', 'Valor(R$)'];

        let categorias = await carregarCategoriasMenosVendidas();
        GerarRelatorio(categorias, "20 Categorias De Produtos Menos Vendidas", header.length, header, data);
    }

    async function carregarCategoriasMenosVendidas()
    {
        let resp = await api.get('/relCategoriasMenosVendidas')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioProdutividadeFuncionarios()
    {
        let header = ['ID', 'Funcionário', 'Quantidade de Vendas', 'Valor Vendido(R$)', 'Valor Ainda Não Recebido(R$)'];

        let funcionarios = await carregarProdutividadeFuncionarios();
        GerarRelatorio(funcionarios, "Produtividade Dos Funcionários", header.length, header, data);
    }

    async function carregarProdutividadeFuncionarios()
    {
        let resp = await api.get('/relProdutividadeFuncionarios')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioFornecedores()
    {
        let header = ['ID', 'Fornecedor', 'CNPJ', 'Email', 'Telefone(1)', 'Telefone(2)', 'Devendo(R$)', 'Parcelas Devendo'];

        let fornecedores = await carregarFornecedores();
        GerarRelatorio(fornecedores, "Fornecedores", header.length, header, data);
    }

    async function carregarFornecedores()
    {
        let resp = await api.get('/relFornecedores')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    async function gerarRelatorioProdutosCondicional()
    {
        let header = ['ID', 'Cliente', 'Produto', 'Categoria', 'Quantidade', 'Data Limite Para Devolução'];

        let produtos = await carregarProdutosCondicional();
        GerarRelatorio(produtos, "Relação de Clientes e Produtos em Condicional", header.length, header, data);
    }

    async function carregarProdutosCondicional()
    {
        let resp = await api.get('/relProdutosCondicional')
        .then((response)=>{
            return response.data;
        });
        return resp;
    }

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <div className='background-relatorios'>
                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Vendas</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório sobre todas as vendas do seu negócio</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioVenda} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Clientes</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório dos seus clientes</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioCliente} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Contas a Receber</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório das suas contas a receber</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioContaReceber} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Contas a Pagar</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório das suas contas a pagar</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioContaPagar} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Estoque</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório do Estoque</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioEstoque} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Categorias Menos Vendidas</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório das 20 ou menos categorias de produtos mais vendidas</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioCategoriaMaisVendidos} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Categorias Mais Vendidas</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório das 20 ou menos categorias de produtos menos vendidas</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioCategoriaMenosVendidos} value="Gerar"></input>
                </div>
                
                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Produtividade</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório da produtividade dos seus funcionários</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioProdutividadeFuncionarios} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Fornecedores</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório de fornecedores</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioFornecedores} value="Gerar"></input>
                </div>

                <div className='card-relatorio'>
                    <div className='rel-titulo'>
                        <h1>Produtos em Condicional</h1>
                    </div>
                    <div className='rel-texto'>
                        <p>Clique aqui para gerar um relatório sobre os produtos em condicional e os clientes que estão com eles</p>
                    </div>
                    <input type="button" onClick={gerarRelatorioProdutosCondicional} value="Gerar"></input>
                </div>
            </div>
        </div>
        </>
    )
}

export default Relatorio;