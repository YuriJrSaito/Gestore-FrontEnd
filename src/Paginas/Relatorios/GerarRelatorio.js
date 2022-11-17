import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment/moment';

function GerarRelatorio(dados, titulo, tamanho, header, data)
{
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const fontes = [
        {
            text: titulo + "  --Relatório Gerado Em: " + data,
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45], //left top right bottom
        }
    ];

    const linhas = dados.map((dado) =>{
        let vetaux = [tamanho];
        for(let x=0; x<tamanho; x++)
        {
            if(dado[x] == null || dado[x] == "")
            {
                dado[x] = "---";
            }
            vetaux[x] = {text: `${dado[x]}`, fontSize: 9, margin: [0, 2, 0, 2]};
        }
        
        return vetaux;
    })

    function total(){
        if(titulo === "Vendas")
        {
            let total = 0;
            for(let dado of dados)
            {
                total = parseFloat(total) + parseFloat(dado[7]); //dado[7] é o valor total não pago em vendas
            }
    
            return [
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: '', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: 'Soma Total', fontSize: 9, margin: [0, 5, 0, 2]},
                    {text: 'R$'+parseFloat(total).toFixed(2), fontSize: 9, margin: [0, 5, 0, 2]},
                ]
        }
        else
        {
            let vet = [];

            for(let x=0; x<tamanho; x++)
            {
                vet[x] = {text: '', fontSize: 9, margin: [0, 5, 0, 2]};
            }
            
            return vet;
        }
    }

    function body()
    {
        let vet = [];
        for(let x=0; x<tamanho; x++)
        {
            vet[x] = {text: `${header[x]}`, style: 'tableHader', fontSize: 10};
        }
        
        return vet;
    }

    function widths()
    {
        let a = [];
        let b = "*"
        for(let x=0; x<tamanho; x++)
        {
            a = [...a, b];
        }
        return a;
    }

    const detalhes = [
        {
            table:{
                headerRows: 1,
                widths: widths(),
                body: [
                    body(),
                    ...linhas,
                    total(),
                ],
            },
            layout: 'lightHorizontalLines',
        }
    ];
    
    function Rodape(currentPage, pageCount)
    {
        return [
            {
                text: currentPage + '/' +pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0],
            }
        ]
    }

    const docDefinicoes = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40], //left top right bottom
        header: [fontes],
        content: [detalhes],
        footer: Rodape,
    }

    pdfMake.createPdf(docDefinicoes).download();
}

export default GerarRelatorio;