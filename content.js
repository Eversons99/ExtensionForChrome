chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        sendResponse({contentBtn: "Reading datas..."})
        const allSNs = request.sns
        const nf = request.NF
        const equipament = request.equipament
        inputSN(allSNs, nf, equipament)
});


async function inputSN(allSNs, nf, equipament){    
   
    const serialNumbers = allSNs
    const noteNumber = nf
    const equipamentModel = equipament
    const itemsPerPage = serialNumbers.length
    
    //Se algum dado não existir o programa para
    if(!serialNumbers || !noteNumber || !equipamentModel) return alert("Insira todos os dados necessários para prosseguir")
   
    console.log(serialNumbers, noteNumber, equipamentModel, itemsPerPage)

    //Araray de contole
    const registerSuccess = []
    
    //URL Principal do IXC
    const url =  'https://assinante.nmultifibra.com.br/aplicativo';
    
    //Filtro //NECESSARRIO ATUALIZAR O FILTRO DE ACORDO COM OS DADOS INSERIDOS PELO USUARIO
    let grid_params = [{"TB":"almox.descricao","display":"Almoxarifado","OP":"=","P":"Almoxarifado Central","C":"AND","G":"_almox.descricao"},{"TB":"patrimonio.descricao","display":"Descrição","OP":"=","P":`${equipamentModel}`,"C":"AND","G":"_patrimonio.descricao"},{"TB":"patrimonio.situacao","display":"Situação","OP":"IN","P":"\"1\",\"7\"","C":"AND","G":"_patrimonio.situacao"},{"TB":"patrimonio.numero_nf","display":"Número NF","OP":"=","P":`${noteNumber}`,"C":"AND","G":"_patrimonio.numero_nf"},{"TB":"patrimonio.serial_fornecedor","display":"Nº Série","OP":"=","P":"","C":"AND","G":"_patrimonio.serial_fornecedor"},{"TB":"patrimonio.serial_fornecedor","display":"Nº Série","OP":"NU","C":"OR","G":"_patrimonio.serial_fornecedor"},{"TB":"patrimonio.serial_fornecedor","display":"Nº Série","OP":"=","P":"0","C":"OR","G":"_patrimonio.serial_fornecedor"}]
    
    //Alteração do filtro para string (padrão aceito pelo IXC)
    let grid_paramsString = JSON.stringify(grid_params)

    //Corpo da requisição, com os meus parametro já alterados
    let params = `page=1&rp=${itemsPerPage}&sortname=patrimonio.valor_bem&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=${grid_paramsString}&grid_param2=false&display=Código`
 
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


    console.log(items)


    console.log(items)
    //Se algum dado não existir o programa para
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
        
        console.log(`ROW ${row}, serial ${serialNumbers[row]}`)
        //Caso de algum erro no SN o programa para aqui
        if(serialNumbers[row] == undefined) return alert("Undefind Serial Number"), printResults (registerSuccess)

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
            registerSuccess.push(currentValue)
            //serialNumbers.splice(row, 1)
            
            console.log(`Peguei a resposta ${myResponse.type}`)
        }else if(myResponse.type == 'error'){
            //Parar a repetição, vou mostrar a messagem de erro para o usuario e apresentar a tabela com os registros que foram salvos com Successo
            console.log(`Peguei a resposta ${myResponse.type}`)
            let currentValue = {
                message: myResponse.message
            }
            const myError = `Erro ao adicionar o registro "${serialNumbers[row]}" ERROR: ${currentValue.message}`
            chrome.runtime.sendMessage({
                error: myError
                
            });
            //printResults (registerSuccess)
            //Para caso ocorra um erro na reposta do IXC
            break
        }
      
  
    }

    printResults (registerSuccess)

}

function printResults (arraySuccess){
    const myDataSuccess = arraySuccess

    chrome.runtime.sendMessage({
        dataSuccess: myDataSuccess}
    );

}
