import '../../App.css';
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

    return (
        <>
        <Header />
        <div className="background-conteudo">
            <input type="button" onClick={gerarRelatorioVenda} value="Gerar Relatorio todas Vendas"></input>
            <input type="button" onClick={gerarRelatorioCliente} value="Gerar Relatorio todos Clientes"></input>
            <input type="button" onClick={gerarRelatorioContaReceber} value="Gerar Relatorio todas Conta Receber"></input>
            <input type="button" onClick={gerarRelatorioContaPagar} value="Gerar Relatorio todas Conta Pagar"></input>
            <input type="button" onClick={gerarRelatorioEstoque} value="Gerar Relatorio Produtos no estoque"></input>
            <input type="button" onClick={gerarRelatorioCategoriaMaisVendidos} value="Mais Vendidos"></input>
            <input type="button" onClick={gerarRelatorioCategoriaMenosVendidos} value="Menos Vendidos"></input>
            <input type="button" onClick={gerarRelatorioProdutividadeFuncionarios} value="Produtividade"></input>
        </div>
        </>
    )
}

export default Relatorio;