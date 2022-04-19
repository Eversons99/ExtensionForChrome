chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        sendResponse({contentBtn: "Processando..."})
        const allSNs = request.sns
        const nf = request.NF
        const equipament = request.equipament
        inputSN(allSNs, nf, equipament)
});


//Validar se o numero de registros retornados bate com o total de SNS 
//Talvez seja necessário alterar o for of para for in, para poder iterar sobre os items do array de sns 

async function inputSN(allSNs, nf, equipament){

    const serialNumbers = allSNs
    const noteNumber = nf
    const equipamentModel = equipament
    
    console.log(serialNumbers, noteNumber, equipamentModel)
    //URL Principal do IXC
    const url =  'https://assinante.nmultifibra.com.br/aplicativo';

    //Define os parametros da consulta (filtro), alterar nmr nf de acordo com a entrada do usuario 
    let params = `page=1&rp=20${itemsPorPagina}&sortname=patrimonio.serial_fornecedor&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=%5B%7B%22TB%22%3A%22almox.descricao%22%2C%22display%22%3A%22Almoxarifado%22%2C%22OP%22%3A%22%3D%22%2C%22P%22%3A%22Almoxarifado+Central%22%2C%22C%22%3A%22AND%22%2C%22G%22%3A%22_almox.descricao%22%7D%2C%7B%22TB%22%3A%22patrimonio.situacao%22%2C%22display%22%3A%22Situa%C3%A7%C3%A3o%22%2C%22OP%22%3A%22IN%22%2C%22P%22%3A%22%5C%221%5C%22%2C%5C%227%5C%22%22%2C%22C%22%3A%22AND%22%2C%22G%22%3A%22_patrimonio.situacao%22%7D%2C%7B%22TB%22%3A%22patrimonio.descricao%22%2C%22display%22%3A%22Descri%C3%A7%C3%A3o%22%2C%22OP%22%3A%22%3D%22%2C%22P%22%3A%22${descricaoEquipamento}Roteador+Huawei+WIFI+WS5200%22%2C%22C%22%3A%22AND%22%2C%22G%22%3A%22_patrimonio.descricao%22%7D%2C%7B%22TB%22%3A%22patrimonio.numero_nf%22%2C%22display%22%3A%22N%C3%BAmero+NF%22%2C%22OP%22%3A%22%3D%22%2C%22P%22%3A%2224863%22%2C%22C%22%3A%22AND%22%2C%22G%22%3A%22_patrimonio.numero_nf${numeroNF}%22%7D%5D&grid_param2=false&display=C%C3%B3digo`

    //Faz a consulta com o filtro 
    const optRows = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        body: params
    }

    //Retorna todos os registros 
    let items = await fetch (`${url}/patrimonio/action/action.php?action=grid`, optRows);
    items = await items.json();

    for (let row of items.rows) {
        let patrimonio = await fetch(`${url}/patrimonio/action/action.php?action=recupera&id=${row.id}`);
        patrimonio = await patrimonio.json();

        let objPatrimonio = {};
        
        patrimonio.forEach(item => {
            if (!objPatrimonio[item.campo]){
                objPatrimonio[item.campo] = item.valor
            }
        })

        //Enviar uma mensagem unica para o meu popup.js e avisar que o processo foi iniciado 
        for( let i in serialNumbers){
            //Realizar o for insiserindo o SN na variavel  params
        }

        //Colocar o SN no parametro tia do Isac
        const params = `id=${row.id}&serial=${objPatrimonio.serial}&id_fornecedor=${objPatrimonio.id_fornecedor}&id_mac=&serial_fornecedor=${serialNumbers[row]}TIA_DO_ISAC&id_almoxarifado=${objPatrimonio.id_almoxarifado}&id_filial=${objPatrimonio.id_filial}&numero_nf=${objPatrimonio.numero_nf}&id_produto=${objPatrimonio.id_produto}&valor_bem=${objPatrimonio.valor_bem}&descricao=${objPatrimonio.descricao}&departamento_id=${objPatrimonio.departamento_id}&responsavel_id=${objPatrimonio.responsavel_id}&data_aquisicao=${objPatrimonio.data_aquisicao}&valor_residual=${objPatrimonio.valor_residual}&situacao=${objPatrimonio.situacao}&estado=${objPatrimonio.estado}&id_movimento_produto=${objPatrimonio.id_movimento_produto}&validacao_form_patrimonio=form_patrimonio`
        const opt = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, 
            body: params
        }

        console.log(opt)
        // let atualizaPatrimonio = await fetch(`${url}/patrimonio/action/action.php?action=edit&id=${row.id}`, opt);
        // atualizaPatrimonio = await atualizaPatrimonio.json()
    }
}