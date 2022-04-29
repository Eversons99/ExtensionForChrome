chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        sendResponse({contentBtn: "Processando..."})
        const allSNs = request.sns
        const nf = request.NF
        const equipament = request.equipament
        inputSN2(allSNs, nf, equipament)
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
    let itemsPorPagina = 60//allSNs.length

    //Filtro
    let grid_params=  [{"TB":"almox.descricao","display":"Almoxarifado","OP":"=","P":"Almoxarifado Central","C":"AND","G":"_almox.descricao"},{"TB":"patrimonio.situacao","display":"Situação","OP":"IN","P":"\"1\",\"7\"","C":"AND","G":"_patrimonio.situacao"},{"TB":"patrimonio.descricao","display":"Descrição","OP":"=","P":`${descricaoEquipamento}`,"C":"AND","G":"_patrimonio.descricao"},{"TB":"patrimonio.numero_nf","display":"Número NF","OP":"=","P":`${notaFiscal}`,"C":"AND","G":"_patrimonio.numero_nf"}]

    //Alteração do filtro para string
    let grid_paramsString = JSON.stringify(grid_params)

    //Corpo da requisição
    let params = `page=1&rp=${itemsPorPagina}&sortname=patrimonio.valor_bem&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=${grid_paramsString}&grid_param2=false&display=Código`

    //Faz a consulta com o filtro 
    const optRows = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        body: params
    }

    //Retorna todos os registros, o número de registros retornados deve ser igual ao numero de SNS 
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


        //Colocar o SN no parametro tia do Isac
        const params = `id=${row.id}&serial=${objPatrimonio.serial}&id_fornecedor=${objPatrimonio.id_fornecedor}&id_mac=&serial_fornecedor=TIA_DO_ISAC&id_almoxarifado=${objPatrimonio.id_almoxarifado}&id_filial=${objPatrimonio.id_filial}&numero_nf=${objPatrimonio.numero_nf}&id_produto=${objPatrimonio.id_produto}&valor_bem=${objPatrimonio.valor_bem}&descricao=${objPatrimonio.descricao}&departamento_id=${objPatrimonio.departamento_id}&responsavel_id=${objPatrimonio.responsavel_id}&data_aquisicao=${objPatrimonio.data_aquisicao}&valor_residual=${objPatrimonio.valor_residual}&situacao=${objPatrimonio.situacao}&estado=${objPatrimonio.estado}&id_movimento_produto=${objPatrimonio.id_movimento_produto}&validacao_form_patrimonio=form_patrimonio`
        const opt = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, 
            body: params
        }

        //console.log(opt)
        console.log(row.id)
        //let atualizaPatrimonio = await fetch(`${url}/patrimonio/action/action.php?action=edit&id=${row.id}`, opt);
        //atualizaPatrimonio = await atualizaPatrimonio.json()
    }
}

//Minha reescrita do codigo acima alterando o looping
//async function inputSN2(allSNs, nf, equipament){


async function inputSN2(serialNumbersa){    
   
    // const serialNumbers = allSNs
    // const noteNumber = nf
    // const equipamentModel = equipament
    // let descricaoEquipamento = "Roteador Huawei WIFI WS5200"
    // let notaFiscal = 24863
    // console.log(serialNumbers, noteNumber, equipamentModel)

    //if(!serialNumbers || !noteNumber || !equipamentModel) return alert("Insira todos os dados necessários para prosseguir")
    
    //URL Principal do IXC
    
    //Ararays de contole
    const registerSucess = []
    const registerError = []

    const url =  'https://assinante.nmultifibra.com.br/aplicativo';
    const serialNumbers = serialNumbersa
    let itemsPorPagina = serialNumbers.length
    

    //Filtro
    let grid_params = [{"TB":"patrimonio.descricao","display":"Descrição","OP":"=","P":"Roteador Huawei WIFI WS5200","C":"AND","G":"_patrimonio.descricao"},{"TB":"patrimonio.data_aquisicao","display":"Data Aquisição","OP":"BE","P":"2022-04-24 00:00:00","P2":"2022-04-30 23:59:59","C":"AND","G":"_patrimonio.data_aquisicao"}]
    
    //Alteração do filtro para string (padrão aceito pelo IXC)
    let grid_paramsString = JSON.stringify(grid_params)

    //Corpo da requisição, com os meus parametro já alterados
    let params = `page=1&rp=${itemsPorPagina}&sortname=patrimonio.valor_bem&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=${grid_paramsString}&grid_param2=false&display=Código`
 

    //Faz a consulta com o filtro 
    const optRows = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        body: params
    }

    //Retorna todos os registros, o número de registros retornados deve ser igual ao numero de SNS 
    let items = await fetch (`${url}/patrimonio/action/action.php?action=grid`, optRows);
    items = await items.json();
    

    if(!items.rows || items.rows.length == 0) return alert("O IXC Não retornou nenhum dado")

    //Loop pela resposta alterando os dados e enviado para o IXC
    for(let row in items.rows){
        let patrimonio = await fetch(`${url}/patrimonio/action/action.php?action=recupera&id=${items.rows[row].id}`);
        patrimonio = await patrimonio.json();
       
        let objPatrimonio = {};
            
        patrimonio.forEach(item => {
            if (!objPatrimonio[item.campo]){
                objPatrimonio[item.campo] = item.valor
            }
        })
        
        //Erro SN para aqui
        if(serialNumbers[row] == undefined) return alert("Undefind Serial Number")

        //Colocar o SN no parametro tia do Isac
        const params = `id=${items.rows[row].id}&serial=${objPatrimonio.serial}&id_fornecedor=${objPatrimonio.id_fornecedor}&id_mac=&serial_fornecedor=${serialNumbers[row]}&id_almoxarifado=${objPatrimonio.id_almoxarifado}&id_filial=${objPatrimonio.id_filial}&numero_nf=${objPatrimonio.numero_nf}&id_produto=${objPatrimonio.id_produto}&valor_bem=${objPatrimonio.valor_bem}&descricao=${objPatrimonio.descricao}&departamento_id=${objPatrimonio.departamento_id}&responsavel_id=${objPatrimonio.responsavel_id}&data_aquisicao=${objPatrimonio.data_aquisicao}&valor_residual=${objPatrimonio.valor_residual}&situacao=${objPatrimonio.situacao}&estado=${objPatrimonio.estado}&id_movimento_produto=${objPatrimonio.id_movimento_produto}&validacao_form_patrimonio=form_patrimonio`
        
        const opt = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, 
            body: params
        }

      
        let updatePatrimonio = await fetch(`${url}/patrimonio/action/action.php?action=edit&id=${items.rows[row].id}`, opt);
        updatePatrimonio = await updatePatrimonio.json()
        const myResponse = updatePatrimonio
        console.log(myResponse)
        if(myResponse.type == 'success'){
            //Inserir os dados em uma tabela que será apresentada para o usuario no final da alterações
            let currentValue = {
                codigo: myResponse.id,
                sn: serialNumbers[row],
                message: myResponse.message
            }
            registerSucess.push(currentValue)
            //serialNumbers.splice(row, 1)
            
            console.log(`Peguei a resposta ${myResponse.type}`)
        }else if(myResponse.type == 'error'){
            //Parar a repetição, vou mostrar a messagem de erro para o usuario e apresentar a tabela com os registros que foram salvos com sucesso
            console.log(`Peguei a resposta ${myResponse.type}`)
            let currentValue = {
                message: myResponse.message
            }
            registerError.push(currentValue)
            //Para caso ocorra um erro na reposta do IXC
            return alert(`Erro ao adicoionar o registro: ERROR: ${currentValue.message}`), printResults ()
        }
  
    }

    console.log(registerSucess)
    console.log(registerError)


    printResults (registerSucess, registerError)
}

function printResults (arraySuccess, arrayError ){
    console.log(`Deu ${arraySuccess}`)

    
    console.log(`Deu ${arrayError}`)
}