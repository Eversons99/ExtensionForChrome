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
    let descricaoEquipamento = "Roteador Huawei WIFI WS5200"
    let notaFiscal = 24863
    let itemsPorPagina = 29

    let grid_params=  [{"TB":"almox.descricao","display":"Almoxarifado","OP":"=","P":"Almoxarifado Central","C":"AND","G":"_almox.descricao"},{"TB":"patrimonio.situacao","display":"Situação","OP":"IN","P":"\"1\",\"7\"","C":"AND","G":"_patrimonio.situacao"},{"TB":"patrimonio.descricao","display":"Descrição","OP":"=","P":`${descricaoEquipamento}`,"C":"AND","G":"_patrimonio.descricao"},{"TB":"patrimonio.numero_nf","display":"Número NF","OP":"=","P":`${notaFiscal}`,"C":"AND","G":"_patrimonio.numero_nf"}]

    let grid_paramsString = JSON.stringify(grid_params)
    //Define os parametros da consulta (filtro), alterar nmr nf de acordo com a entrada do usuario 
    let params = `page=1&rp=${itemsPorPagina}&sortname=patrimonio.valor_bem&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=${grid_paramsString}&grid_param2=false&display=Código`

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