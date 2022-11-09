import React from 'react';

export const manualDados = [

    //Cadastro de Produtos ---------------------------------------------------------------------------------------
    {
        titulo: 'Filtro : "Pesquisar por Nome"',
        categoria: 'cadProdutoTabela',
        texto: 'Este campo serve para a filtragem de dados, ao escrever, a tabela ira mostrar apenas as linhas convenientes ao filtro',
        campo: "filtro",
    },
    {
        titulo: 'Botão Recarregar : "Recarregar"',
        categoria: 'cadProdutoTabela',
        texto: 'Ao clicar neste botão a lista de produtos será recarregada, se os produtos não estiverem sendo exibidos clique neste botão',
        campo: "recarregar",
    },
    {
        titulo: 'Botão Cadastrar novo: "Cadastrar novo"',
        categoria: 'cadProdutoTabela',
        texto: 'Ao clicar neste botão o formulário de cadastro de um novo produto sera aberto',
        campo: "cadastrarNovo",
    },
    {
        titulo: 'Linha Tabela',
        categoria: 'cadProdutoTabela',
        texto: 'Ao clicar em alguma linha da tabela será aberto o formulario com os dados do produto referente a linha, sendo possivel edita-los',
        campo: "table",
    },
    {
        titulo: 'Linha Tabela : " X - Excluír"',
        categoria: 'cadProdutoTabela',
        texto: 'Ao clicar neste x será aberto um componente com algumas informações sobre a exclusão',
        campo: "tabela-excluir",
    },
    {
        titulo: 'Título: "Digite o título"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva o título do produto, permitido usar letrar e números',
        obrigatorio: 'Sim',
        max: '50',
        campo: "titulo",
    },
    {
        titulo: 'Código de Referência: "Digite o Código de referência"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva o código de referencia do produto, permitido letras e números',
        obrigatorio: 'Não',
        max: '20',
        campo: "codigoRef",
    },
    {
        titulo: 'Quantidade no Estoque: "Digite a quantidade"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva a quantidade deste produto no estoque, permitido apenas número maiores que 0 (zero)',
        obrigatorio: 'Sim',
        campo: "qtdeEstoque",
    },
    {
        titulo: 'Descrição: "Digite a descrição"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva a descrição do produto como, cor e tamanho ou outras informações',
        obrigatorio: 'Não',
        max: 50,
        campo: "descricao",
    },
    {
        titulo: 'Valor Unitário: "Digite o valor unitário"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva o preço em que cada unidade deste produto é vendido em sua loja, apenas números',
        obrigatorio: 'Sim',
        campo: "valorUnitario",
    },
    {
        titulo: 'Valor de Compra: "Digite o valor de compra"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva o preço que você paga em cada unidade deste produto para o seu fornecedor',
        obrigatorio: 'Não',
        campo: "valorCompra",
    },
    {
        titulo: 'Fornecedor: "Escolha um Fornecedor"',
        categoria: 'cadProdutoForm',
        texto: 'Selecione o fornecedor deste produto, dica: para produtos que não possuem fornecedores, cadastre um fornecedor em "Menu => Fornecedor" com o nome "Sem Fornecedor"',
        obrigatorio: 'Sim',
        campo: "selFornecedor",
    },
    {
        titulo: 'Categoria: "Escolha uma Categoria"',
        categoria: 'cadProdutoForm',
        texto: 'Selecione a categoria deste produto, você pode cadastrar novas Categorias em "Menu => Categorias" ou no botão abaixo',
        obrigatorio: 'Sim',
        campo: "selCategoria",
    },
    {
        titulo: 'Nova Categoria: "Nova Categoria"',
        categoria: 'cadProdutoForm',
        texto: 'Ao clicar neste botão sera aberto um novo campo onde sera possivel cadastrar rapidamente uma nova categoria, para sua exclusão acesse "Menu => Categoria"',
        campo: "btnCargo",
    },
    {
        titulo: 'Cadastrar Nova Categoria: "Digite a Categoria"',
        categoria: 'cadProdutoForm',
        texto: 'Escreva aqui sua nova categoria de produtos',
        campo: "cargo",
    },
    {
        titulo: 'Cadastrar Nova Categoria: "Cadastrar"',
        categoria: 'cadProdutoForm',
        texto: 'Após ter digitado sua Categoria, clique aqui para efetivar seu cadastro de nova categoria',
        campo: "buttonNCategoria",
    },
    {
        titulo: 'Imagems : "+"',
        categoria: 'cadProdutoForm',
        texto: 'Ao clicar nos botões "+" será aberto o explorador de arquivos, onde você poderá selecionar 1 imagem para cada "+"',
        campo: "arquivos",
    },
    {
        titulo: 'Botões : "Limpar"',
        categoria: 'cadProdutoForm',
        texto: 'Ao clicar todos os dados e mensagens de erro no formulário serão apagados',
        campo: "limpar",
    },
    {
        titulo: 'Botões : "Salvar ou Alterar"',
        categoria: 'cadProdutoForm',
        texto: 'Caso o botão esteja em modo "Salvar", ao ser clicado ele validará todos os dados preenchidos e irá efetivar o cadastro de um novo produto, caso esteja em modo "Alterar", também validará os dados e irá confirmar a alteração do produto selecionado',
        campo: "btnForm",
    },
    {
        titulo: 'Botões : "Cancelar"',
        categoria: 'cadProdutoEx',
        texto: 'Ao clicar você fechara está aba e o produto não sera excluído',
        campo: "cancelar",
    },
    {
        titulo: 'Botões : "Deletar"',
        categoria: 'cadProdutoEx',
        texto: 'Ao clicar você irá efetivar a exclusão, caso este botão não esteja visível, leia a mensagem atentamente',
        campo: "excluir",
    },
    //Fim cadastro de produtos------------------------------------------------------------------------------------------------------------
    
    //Cadastro de Fornecedores ---------------------------------------------------------------------------------------
    {
        titulo: 'Filtro : "Pesquisar por Nome"',
        categoria: 'cadFornecedorTabela',
        texto: 'Este campo serve para a filtragem de dados, ao escrever, a tabela ira mostrar apenas as linhas convenientes ao filtro',
        campo: "filtro",
    },
    {
        titulo: 'Botão Recarregar : "Recarregar"',
        categoria: 'cadFornecedorTabela',
        texto: 'Ao clicar neste botão a lista de fornecedores será recarregada, se os fornecedores não estiverem sendo exibidos clique neste botão',
        campo: "recarregar",
    },
    {
        titulo: 'Botão Cadastrar novo: "Cadastrar novo"',
        categoria: 'cadFornecedorTabela',
        texto: 'Ao clicar neste botão o formulário de cadastro de um novo fornecedor sera aberto',
        campo: "cadastrarNovo",
    },
    {
        titulo: 'Linha Tabela',
        categoria: 'cadFornecedorTabela',
        texto: 'Ao clicar em alguma linha da tabela será aberto o formulario com os dados do fornecedor referente a linha, sendo possivel edita-los',
        campo: "table",
    },
    {
        titulo: 'Linha Tabela : " X - Excluír"',
        categoria: 'cadFornecedorTabela',
        texto: 'Ao clicar neste x será aberto um componente com algumas informações sobre a exclusão',
        campo: "tabela-excluir",
    },
    {
        titulo: 'Botões : "Cancelar"',
        categoria: 'cadFornecedorEx',
        texto: 'Ao clicar você fechara está aba e o fornecedor não sera excluído',
        campo: "cancelar",
    },
    {
        titulo: 'Botões : "Deletar"',
        categoria: 'cadFornecedorEx',
        texto: 'Ao clicar você irá efetivar a exclusão, caso este botão não esteja visível, leia a mensagem atentamente',
        campo: "excluir",
    },
    {
        titulo: 'Nome : "Digite o Nome"',
        categoria: 'cadFornecedorForm',
        texto: 'Escreva o nome do fornecedor, é permitido letra e números',
        obrigatorio: "Sim",
        max: 30,
        campo: "nome",
    },
    {
        titulo: 'CNPJ : "xx.xxx.xxx/xxxx-xx"',
        categoria: 'cadFornecedorForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números',
        obrigatorio: "Não",
        max: 14,
        campo: "cnpj",
    },
    {
        titulo: 'Email : "exemplo@email.com"',
        categoria: 'cadFornecedorForm',
        texto: 'Siga o email de exemplo, é necessario possuir "@" "email" e ".com" para ser validado',
        obrigatorio: "Não",
        campo: "email",
    },
    {
        titulo: 'Telefone (Primeiro): "(xx)xxxxx-xxxx"',
        categoria: 'cadFornecedorForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números',
        obrigatorio: "Não",
        max: 11,
        campo: "telefone1",
    },
    {
        titulo: 'Telefone (Segundo): "(xx)xxxxx-xxxx"',
        categoria: 'cadFornecedorForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números',
        obrigatorio: "Não",
        max: 11,
        campo: "telefone2",
    },
    {
        titulo: 'Botões : "Limpar"',
        categoria: 'cadFornecedorForm',
        texto: 'Ao clicar todos os dados e mensagens de erro no formulário serão apagados',
        campo: "limpar",
    },
    {
        titulo: 'Botões : "Salvar ou Alterar"',
        categoria: 'cadFornecedorForm',
        texto: 'Caso o botão esteja em modo "Salvar", ao ser clicado ele validará todos os dados preenchidos e irá efetivar o cadastro de um novo fornecedor, caso esteja em modo "Alterar", também validará os dados e irá confirmar a alteração do fornecedor selecionado',
        campo: "btnForm",
    },
    //Fim cadastro de fornecedores------------------------------------------------------------------------------------------------------------

    //Cadastro de usuários------------------------------------------------------------------------------------------------------------
    {
        titulo: 'Filtro : "Pesquisar por Nome"',
        categoria: 'cadUsuarioTabela',
        texto: 'Este campo serve para a filtragem de dados, ao escrever, a tabela ira mostrar apenas as linhas convenientes ao filtro',
        campo: "filtro",
    },
    {
        titulo: 'Botão Recarregar : "Recarregar"',
        categoria: 'cadUsuarioTabela',
        texto: 'Ao clicar neste botão a lista de usuários será recarregada, se os usuários não estiverem sendo exibidos clique neste botão',
        campo: "recarregar",
    },
    {
        titulo: 'Botão Cadastrar novo: "Cadastrar novo"',
        categoria: 'cadUsuarioTabela',
        texto: 'Ao clicar neste botão o formulário de cadastro de um novo usuário será aberto',
        campo: "cadastrarNovo",
    },
    {
        titulo: 'Linha Tabela',
        categoria: 'cadUsuarioTabela',
        texto: 'Ao clicar em alguma linha da tabela será aberto o formulario com os dados do usuário referente a linha, sendo possivel edita-los',
        campo: "table",
    },
    {
        titulo: 'Linha Tabela : "X - Excluír"',
        categoria: 'cadUsuarioTabela',
        texto: 'Ao clicar neste x será aberto um componente com algumas informações sobre a exclusão',
        campo: "tabela-excluir",
    },
    {
        titulo: 'Botões : "Cancelar"',
        categoria: 'cadUsuarioEx',
        texto: 'Ao clicar você fechara está aba e o usuário não sera excluído',
        campo: "cancelar",
    },
    {
        titulo: 'Botões : "Deletar"',
        categoria: 'cadUsuarioEx',
        texto: 'Ao clicar você irá efetivar a exclusão, caso este botão não esteja visível, leia a mensagem atentamente',
        campo: "excluir",
    },
    {
        titulo: 'Botões : "Deletar"',
        categoria: 'cadUsuarioFormEx',
        texto: 'Ao clicar você irá efetivar a exclusão, caso este botão não esteja visível, leia a mensagem atentamente',
        campo: "excluir",
    },
    {
        titulo: 'Nome Completo : "Digite o Nome"',
        categoria: 'cadUsuarioForm',
        texto: 'Preencha este campo com o nome completo do usuário',
        obrigatorio: "Sim",
        max: 50,
        campo: "nome",
    },
    {
        titulo: 'CPF : "xxx.xxx.xxx-xx"',
        categoria: 'cadUsuarioForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números, o CPF deve ter 11 caracteres',
        obrigatorio: "Não",
        max: 11,
        campo: "cpf",
    },
    {
        titulo: 'Idade : "Digite a idade"',
        categoria: 'cadUsuarioForm',
        texto: 'Digite apenas números, maiores que 13(zero) e menores que 100(cem)',
        obrigatorio: "Não",
        max: 2,
        campo: "idade",
    },
    {
        titulo: 'Sexo : "Feminino"',
        categoria: 'cadUsuarioForm',
        texto: 'Selecione este campo para mulheres',
        obrigatorio: "Não",
        campo: "fem",
    },
    {
        titulo: 'Sexo : "Masculino"',
        categoria: 'cadUsuarioForm',
        texto: 'Selecione este campo para homens',
        obrigatorio: "Não",
        campo: "mas",
    },
    {
        titulo: 'Email : "exemplo@email.com"',
        categoria: 'cadUsuarioForm',
        texto: 'Siga o email de exemplo, é necessario possuir "@" "email" e ".com" para ser validado',
        obrigatorio: "Não",
        campo: "email",
    },
    {
        titulo: 'Cadastrar Contato : "(xx)xxxxx-xxxx"',
        categoria: 'cadUsuarioForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números, é obrigatório pelo menos 1 telefone cadastrado, e é permitido no máximo 3 telefones',
        obrigatorio: "Sim",
        max: 11,
        campo: "cadTel",
    },
    {
        titulo: 'Cadastrar Contato : "Adicionar"',
        categoria: 'cadUsuarioForm',
        texto: 'Ao clicar vc irá adicionar o telefone preenchido há lista',
        campo: "addTel",
    },
    {
        titulo: 'Tabela Telefones Botão: "Excluír"',
        categoria: 'cadUsuarioForm',
        texto: 'Ao clicar vc irá retirar o telefone referente a linha da tabela',
        campo: "excTel",
    },
    {
        titulo: 'CEP : "xxxxx-xxx"',
        categoria: 'cadUsuarioForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números',
        obrigatorio: "Não",
        max: 8,
        campo: "cep",
    },
    {
        titulo: 'Cidade : "Digite a cidade"',
        categoria: 'cadUsuarioForm',
        texto: 'Preencha este campo com a cidade de residência do usuário',
        obrigatorio: "não",
        max: 30,
        campo: "cidade",
    },
    {
        titulo: 'Rua : "Digite a rua"',
        categoria: 'cadUsuarioForm',
        texto: 'Digite a rua de residência do usuário',
        obrigatorio: "não",
        max: 50,
        campo: "rua",
    },
    {
        titulo: 'Número : "Digite o número"',
        categoria: 'cadUsuarioForm',
        texto: 'Não digite os símbolos ou caracteres que não forem números, não digite números menores que 0(zero)',
        obrigatorio: "não",
        campo: "numero",
    },
    {
        titulo: 'Bairro : "Digite o bairro"',
        categoria: 'cadUsuarioForm',
        texto: 'Digite o bairro do usuário',
        obrigatorio: "não",
        max: 30,
        campo: "bairro",
    },
    {
        titulo: 'Complemento : "Digite o complemento"',
        categoria: 'cadUsuarioForm',
        texto: 'Digite um complemento referente ao endereço do usuário',
        obrigatorio: "não",
        max: 30,
        campo: "complemento",
    },
    {
        titulo: 'Botões : "Limpar"',
        categoria: 'cadUsuarioForm',
        texto: 'Ao clicar todos os dados e mensagens de erro no formulário serão apagados',
        campo: "limpar",
    },
    {
        titulo: 'Botões : "Próximo"',
        categoria: 'cadUsuarioForm',
        texto: 'Ao clicar os campos deste formulário serão validados, e caso for bem sucessido o formulário de informações de usuário será aberto',
        campo: "btnForm",
    },
    {
        titulo: 'Cargo : "Escolha um cargo"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Selecione o cargo do novo usuário do sistema, é possivel cadastrar novos cargos em "Menu=>Cargos" ou no botão abaixo',
        obrigatorio: "Sim",
        campo: "selCargo",
    },
    {
        titulo: 'Cargo Botão: "Novo Cargo"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Ao clicar será aberto novos campos, onde será possível cadastrar rapidamente um novo cargo',
        campo: "btnCargo",
    },
    {
        titulo: 'Cadastrar Novo Cargo: "Digite o cargo"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Preencha este campo com o novo cargo',
        campo: "cargo",
    },
    {
        titulo: 'Cadastrar Novo Cargo: "Cadastrar"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Ao clicar será efetivado o cadastro do cargo preenchido no campo anterior',
        campo: "cadCargo",
    },
    {
        titulo: 'Nível Acesso: "Escolha um nível de acesso"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Nível de acesso "Funcionário" possuíra algumas limitações de acesso a algumas funções do sistema, o nível "Admnistrador" possui acesso completo',
        obrigatorio: "Sim",
        campo: "nivelAc",
    },
    {
        titulo: 'Salário: "Digite o Salário"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Digite apenas números maiores que 0(zero)',
        obrigatorio: "Sim",
        campo: "salario",
    },
    {
        titulo: 'Data Admissão: "dd/mm/aaaa"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Clique no ícone ao fim deste campo e irá abrir um calendário, selecione a data de admissão do usuário',
        obrigatorio: "Sim",
        campo: "dataEmissao",
    },
    {
        titulo: 'Data Demissão: "dd/mm/aaaa"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Clique no ícone ao fim deste campo e irá abrir um calendário, selecione a data de demissão do usuário, caso o usuário não esteja demitido, não selecione',
        obrigatorio: "Não",
        campo: "dataDemissao",
    },
    {
        titulo: 'Botões : "Limpar"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Ao clicar todos os dados e mensagens de erro no formulário serão apagados',
        campo: "limpar",
    },
    {
        titulo: 'Botões : "Próximo"',
        categoria: 'cadUsuarioFormDados',
        texto: 'Ao clicar os campos deste formulário serão validados, e caso for bem sucessido o formulário de informações de acesso será aberto',
        campo: "btnForm",
    },
    {
        titulo: 'Login : "Digite o nome de usuário"',
        categoria: 'cadUsuarioFormAcesso',
        texto: 'Digite um nome de usuário, não precisa ser o nome pessoal do usuário, o sistema validará nomes de usuários iguais',
        obrigatorio: "Sim",
        max: 30,
        campo: "login",
    },
    {
        titulo: 'Senha : "Digite a senha"',
        categoria: 'cadUsuarioFormAcesso',
        texto: 'Digite uma senha forte, é permitido letras e números',
        obrigatorio: "Sim",
        max: 30,
        campo: "senha",
    },
    {
        titulo: 'Botões : "Limpar"',
        categoria: 'cadUsuarioFormAcesso',
        texto: 'Ao clicar todos os dados e mensagens de erro no formulário serão apagados',
        campo: "limpar",
    },
    {
        titulo: 'Botões : "Salvar ou Alterar"',
        categoria: 'cadUsuarioFormAcesso',
        texto: 'Caso o botão esteja em modo "Salvar", ao ser clicado ele validará todos os dados preenchidos e irá efetivar o cadastro de um novo usuário, caso esteja em modo "Alterar", também validará os dados e irá confirmar a alteração do usuário selecionado',
        campo: "btnForm",
    },
    //Fim cadastro de usuário------------------------------------------------------------------------------------------------------------
]