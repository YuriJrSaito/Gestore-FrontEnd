import React from 'react';
//import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
//import * as IoIcons from 'react-icons/io';
import * as HiIcons from "react-icons/hi";
import * as FiIcons from 'react-icons/fi';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as GrIcons from 'react-icons/gr';
import * as FaIcons from 'react-icons/fa';


export const sidebarDados = [
    {
        titulo: 'Início',
        caminho: '/home',
        icone: <AiIcons.AiFillHome/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "home",
    },
    {
        titulo: 'Produtos',
        caminho: '/cadastroProduto',
        icone: <GrIcons.GrProductHunt/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "Produto",
    },
    {
        titulo: 'Fornecedor',
        caminho: '/cadastroFornecedor',
        icone: <FaIcons.FaHandshake/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "Cadastro",
    },
    {
        titulo: 'Usuário',
        caminho: '/cadastroUsuario',
        icone: <FaIcons.FaUserCog/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "Usuário",
    },
    {
        titulo: 'Cliente',
        caminho: '/cadastroCliente',
        icone: <FaIcons.FaUserTag/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "Cadastro",
    },
    {
        titulo: 'Cargo',
        caminho: '/cadastroCargo',
        icone: <FaIcons.FaUsers/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "Usuário",
    },
    {
        titulo: 'Categoria Produto',
        caminho: '/cadastroCategoria',
        icone: <MdIcons.MdOutlineCategory/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "Produto",
    },
    {
        titulo: 'Realizar Venda',
        caminho: '/realizarVenda',
        icone: <MdIcons.MdLocalGroceryStore/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "Venda",
    },
    {
        titulo: 'Venda Condicional',
        caminho: '/realizarVendaCondicional',
        icone: <MdIcons.MdOutlineProductionQuantityLimits/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "VendaCondicional",
    },
    {
        titulo: 'Devolver Condicional',
        caminho: '/devolverCondicional',
        icone: <MdIcons.MdProductionQuantityLimits/>,
        cNome: 'nav-text',
        nivel: 20,
        categoria: "VendaCondicional",
    },
    {
        titulo: 'Contas a Pagar',
        caminho: '/contaPagar',
        icone: <GiIcons.GiPayMoney/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "Conta",
    },
    {
        titulo: 'Ver Contas a Receber',
        caminho: '/contaReceber',
        icone: <GiIcons.GiReceiveMoney/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "Conta",
    },
    {
        titulo: 'Relatórios',
        caminho: '/principalRelatorios',
        icone: <HiIcons.HiDocumentReport/>,
        cNome: 'nav-text',
        nivel: 60,
        categoria: "relatório",
    },
    {
        titulo: 'Ajuda',
        caminho: '/home',
        icone: <FiIcons.FiHelpCircle/>,
        cNome: 'nav-text',
        nivel: 20,
    },
]

/*    {
        titulo: 'Ver Estoque',
        caminho: '/home',
        icone: <MdIcons.MdInventory/>,
        cNome: 'nav-text',
        nivel: 60,
    },*/