class Validar{

    async validarEmail(email) //cadastroUsuario //cadastroCliente
    {
        if(email == "")
            return true;
        var exp = /^[a-z0-9-_.]+@[a-z0-9]+\.com/;
        if(exp.test(email))
            return true;

        document.querySelector("#msgEmail").innerHTML = "<p>Email inválido</p>"
        return false;
    }

    async validarCPF(cpf) //cadastroUsuario //cadastroCliente
    {
        var exp = /(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/;
        if(exp.test(cpf))
            return true;

        document.querySelector("#msgCPF").innerHTML = "<p>CPF inválido</p>";
        return false;
    }

    async formatarCPF(cpf) //cadastroUsuario //cadastroCliente
    {
        var retorno = true;
        if(cpf != "")
        {
            if(cpf.length > 11 || cpf.length < 11)
            {
                document.querySelector("#msgCPF").innerHTML = "<p>CPF inválido</p>";
                return false;
            }
            else
            {
                var val = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                retorno = await this.validarCPF(val);
            }

        }
        return retorno;
    }

    async validarNome(nome, max, tag, tipo) //cadastroUsuario //cadastroCliente //cadastroFornecedor //cadastroProduto
    {
        if(nome == "")
        {
            document.querySelector(tag).innerHTML=`<p>Digite um ${tipo}</p>`; 
            //document.body.scrollTop = document.documentElement.scrollTop = 0;
            return false;
        }
        if(nome.length > max)
        {
            document.querySelector(tag).innerHTML=`<p>${tipo} deve ter no máximo ${max} caracteres</p>`;
            return false;
        }
        return true;
    }

    async validarNumero(numero) //cadastroUsuario //cadastroCliente
    {
        var retorno = true;
        if(numero != "")
        {
            if(parseInt(numero) < 0)
            {
                document.querySelector("#msgNumero").innerHTML = "<p>Número inválido</p>";
                retorno = false;
            }
            if(await this.mascaraNumero(numero) == false)
            {
                document.querySelector("#msgNumero").innerHTML = "<p>Digite apenas Números</p>";
                retorno = false;
            }
        }   
        return retorno;
    }

    async mascaraNumero(valor) //cadastroUsuario //cadastroCliente
    {
        var exp = /^\d+$/;
        if(exp.test(parseInt(valor)))
            return true; 
        return false
    }

    async validarIdade(idade) //cadastroUsuario //cadastroCliente
    {
        var retorno = true;
        if(idade != "")
        {
            if(parseInt(idade) < 13 || parseInt(idade)>100)
            {
                document.querySelector("#msgIdade").innerHTML = "<p>Idade inválida</p>";
                retorno = false;
            }
            if(await this.mascaraNumero(idade) == false)
            {
                document.querySelector("#msgIdade").innerHTML = "<p>Digite apenas Números</p>";
                retorno = false;
            }
        }

        return retorno;
    }

    async formatarCep(cep) //cadastroUsuario //cadastroCliente
    {
        console.log(cep);
        var retorno = true;
        if(cep != "")
        {
            var exp = /^\d+$/;
            if(exp.test(parseInt(cep)))
            {
                var val = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
                retorno = await this.validarCep(val);
            }
            else
            {
                document.querySelector("#msgCep").innerHTML = "<p>Digite apenas Números</p>";
                return false;
            }
        }
        return retorno;
    }

    async validarCep(cep) //cadastroUsuario //cadastroCliente
    {
        var exp = /(\d{5})-(\d{3})/;
        if(exp.test(cep))
            return true;

        document.querySelector("#msgCep").innerHTML = "<p>CEP inválido</p>";
        return false;
    }

    async validarComplemento(complemento) //cadastroUsuario //cadastroCliente
    {
        if(complemento != "")
        {
            if(complemento.length > 30)
            {
                document.querySelector("#msgComplemento").innerHTML = "<p>Complemento deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }   

    async validarCidade(cidade) //cadastroUsuario //cadastroCliente
    {
        if(cidade != "")
        {
            if(cidade.length > 30)
            {
                document.querySelector("#msgCidade").innerHTML = "<p>Cidade deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async validarBairro(bairro) //cadastroUsuario //cadastroCliente
    {
        if(bairro != "")
        {
            if(bairro.length > 30)
            {
                document.querySelector("#msgBairro").innerHTML = "<p>Bairro deve ter no máximo 30 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async validarRua(rua) //cadastroUsuario //cadastroCliente
    {
        if(rua != "")
        {
            if(rua.length > 50)
            {
                document.querySelector("#msgRua").innerHTML = "<p>Rua deve ter no máximo 50 caracteres</p>";
                return false;
            }
        }
        return true;
    }

    async validarCargo(idCargo) //cadastroUsuario
    {
        console.log(idCargo);
        if(idCargo == '' || idCargo == 0)
        {
            document.querySelector("#msgCargo").innerHTML = "<p>Selecione um cargo</p>";
            return false;
        }
        
        return true;
    }

    async validarNivel(nivelAcesso) //cadastroUsuario
    {
        if(nivelAcesso == 0)
        {
            document.querySelector("#msgNivel").innerHTML = "<p>Selecione um nível</p>";
            return false;
        }
        return true;
    }

    async validarSalario(salario) //cadastroUsuario
    {
        if(salario == "")    
        {
            document.querySelector("#msgSalario").innerHTML = "<p>Digite um salário</p>";
            return false;
        }
        return true;
    }

    async validarDataEmissaoObrigatoria(dataEmissao) //cadastroUsuario
    {
        if(dataEmissao == "")
        {
            document.querySelector("#msgEmissao").innerHTML = "<p>Selecione a data de emissão</p>";
            return false;
        }
        return true;
    }

    async validarDataDemissao(dataDemissao, dataEmissao) //cadastroUsuario
    {
        if(dataDemissao != "")
        {
            if(dataDemissao < dataEmissao)
            {
                document.querySelector("#msgDemissao").innerHTML = "<p>Data de demissão deve ser maior que Data de emissão</p>";
                return false;
            }
        }
        return true;
    }

    async validarLogin(login) //cadastroUsuario
    {
        if(login == "")
        {
            document.querySelector("#msgLogin").innerHTML = "<p>Digite o login</p>";
            return false;
        }
        return true;
    }

    async validarSenha(senha) //cadastroUsuario
    {
        if(senha == "")
        {
            document.querySelector("#msgSenha").innerHTML = "<p>Digite a senha</p>";
            return false;
        }
        return true;
    }

    async validarDescObrigatoria(desc, doc, msg1, msg2) //cadastroCategoria //cadastroCargo
    {
        if(desc == "")
        {
            doc.innerHTML = msg1;
            return false;
        }
        if(desc.length > 30)
        {
            doc.innerHTML = msg2;
            return false;
        }
           
        return true;
    }

    async validarCnpj(cnpj) //cadastroFornecedor
    {
        if(cnpj == "")
            return true;
        var exp = /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})/;
        if(exp.test(cnpj))
            return true;

        document.querySelector("#msgCnpj").innerHTML = "<p>CNPJ inválido</p>";
        return false;
    }

    async formatarCnpj(cnpj) //cadastroFornecedor
    {
        var retorno = true;
        if(cnpj != "")
        {
            if(cnpj.length > 14)
            {
                document.querySelector("#msgCnpj").innerHTML = "<p>CNPJ inválido</p>";
                return false;
            }
            else
            {
                var val = await cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                //setCnpj(val);
                retorno = await this.validarCnpj(val);
            }
        }
        return retorno;
    }

    async validarCodigo(codigoRef) //cadastroProduto
    {
        if(codigoRef != "" && codigoRef.length > 20)
        {
            document.querySelector("#msgCodigoRef").innerHTML="<p>Código de referência deve ter no máximo 20 caracteres</p>";
            return false;
        }
        return true;        
    }

    async validarQuantidadeObrigatorio(qtde, doc, max, msgAviso1, msgAviso2, msgAviso3, msgAviso4) //cadastroProduto //contaPagar
    {
        if(qtde == "")
        {
            document.querySelector(doc).innerHTML=msgAviso1; 
            return false;
        }
        if(qtde < 0)
        {
            document.querySelector(doc).innerHTML=msgAviso2;
            return false;
        }
        if(max > 0 && qtde > max)
        {
            document.querySelector(doc).innerHTML=msgAviso4;
            return false;
        }
        if(await this.mascaraNumero(qtde) == false)
        {
            document.querySelector(doc).innerHTML = msgAviso3;
            return false;
        }
        return true;      
    }

    async validarStringOpcional(frase, maxCaracteres, doc, msgAviso) //cadastroProduto //ContaPagar
    {
        if(frase != "" && frase.length > maxCaracteres)
        {
            document.querySelector(doc).innerHTML = msgAviso;
            return false;
        }
        return true;        
    }

    async validarValorUnitario(valorUnitario) //cadastroProduto
    {
        if(valorUnitario == "")
        {
            document.querySelector("#msgValorUnitario").innerHTML="<p>Digite o valor unitário</p>"; 
            return false;
        }
        if(valorUnitario < 0)
        {
            document.querySelector("#msgValorUnitario").innerHTML="<p>Valor unitário deve ser maior ou igual a 0 (zero)</p>";
            return false;
        }
        return true;    
    }

    async validarValorCompra(valorCompra) //cadastroProduto
    {
        if(valorCompra != "" && valorCompra < 0)
        {
            document.querySelector("#msgValorCompra").innerHTML="<p>Valor de compra deve ser maior ou igual a 0 (zero)</p>";
            return false;
        }
        return true;    
    }

    async validarFonecedores(fornecedores) //cadastroProduto //contaPagar
    {
        if(fornecedores == "")
        {
            document.querySelector("#msgFornecedor").innerHTML="<p>Cadastre fornecedores</p>";
            return false;
        }
        return true;    
    }

    async validarCategoria(idCategoria) //cadastroProduto
    {
        if(idCategoria == "")
        {
            document.querySelector("#msgCategoria").innerHTML="<p>Selecione uma categoria</p>";
            return false;
        }
        return true;    
    }

    async validarDataEmissaoOpcional(dataEmissao) //contaPagar
    {
        if(dataEmissao == "")
        {
            document.querySelector("#msgEmissao").innerHTML = "<p>Selecione a data de emissão</p>";
            return false;
        }
        return true;
    }

    async validarDataVencimento(dataVencimento, dataEmissao) //contaPagar
    {
        if(dataVencimento == "")
        {
            document.querySelector("#msgVencimento").innerHTML = "<p>Selecione a data de vencimento da primeira parcela</p>";
            return false;
        }
        if(dataEmissao != "")
        {
            if(dataVencimento < dataEmissao)
            {
                document.querySelector("#msgVencimento").innerHTML = "<p>Data de vencimento deve ser maior que Data de Emissão</p>";
                return false;
            }
        }
        return true;
    }

    async validarFornecedorObrigatorio(idFornecedor) //contaPagar
    {
        if(idFornecedor == 0)
        {
            document.querySelector("#msgFornecedor").innerHTML = "<p>Selecione um Fornecedor</p>";
            return false;
        }
        return true;
    }

    async validarValorTotalObrigatorio(valorTotal) //contaPagar
    {
        if(valorTotal == "")
        {
            document.querySelector("#msgValorTotal").innerHTML = "<p>Valor Inválido</p>";
            return false;
        }
        else
        {
            if(parseInt(valorTotal) < 0)
            {
                document.querySelector("#msgValorTotal").innerHTML = "<p>Digite valores maiores que Zero</p>";
                return false;
            }
            if(await this.mascaraNumero(valorTotal) == false)
            {
                document.querySelector("#msgValorTotal").innerHTML = "<p>Digite apenas Números</p>";
                return false;
            }
        }
        return true; 
    }
}

export default Validar;