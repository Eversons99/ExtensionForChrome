f

// let mySerials = [789895102790144, 789895102790245, 789895102790346, 789895102790447, 789895102790548, 789895102790649, 789895102790750, 789895102790851, 789895102790952, 789895102790953]
// async function inputSN2(mySerials){    
   
//     const serialNumbers = mySerials
//     const url =  'https://assinante.nmultifibra.com.br/aplicativo';
//     let itemsPorPagina = serialNumbers.length
    
    
//     let grid_params = [{"TB":"patrimonio.descricao","display":"Descrição","OP":"=","P":"Roteador Huawei WIFI WS5200 ","C":"AND","G":"_patrimonio.descricao"},{"TB":"patrimonio.data_aquisicao","display":"Data Aquisição","OP":"=","P":"2022-04-25","C":"AND","G":"_patrimonio.data_aquisicao"}]
        
//     //Alteração do filtro para string
//     let grid_paramsString = JSON.stringify(grid_params)
    
//     //Corpo da requisição
//     let params = `page=1&rp=${itemsPorPagina}&sortname=patrimonio.valor_bem&sortorder=desc&query=&qtype=patrimonio.id&oper=L&grid_param=${grid_paramsString}&grid_param2=false&display=Código`
     
//     //Faz a consulta com o filtro 
//     const optRows = {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         }, 
//         body: params
//     }
    
//     //Retorna todos os registros, o número de registros retornados deve ser igual ao numero de SNS 
//     let items = await fetch (`${url}/patrimonio/action/action.php?action=grid`, optRows);
//     items = await items.json();

        


    
//     for(let row in items.rows){

//         let patrimonio = await fetch(`${url}/patrimonio/action/action.php?action=recupera&id=${items.rows[row].id}`);
//         patrimonio = await patrimonio.json();
        
        
    
//         let objPatrimonio = {};
                
//         patrimonio.forEach(item => {
//             if (!objPatrimonio[item.campo]){
//                 objPatrimonio[item.campo] = item.valor
//             }
//         })
//           console.log({
//               objPatrimonio: objPatrimonio,
//               index: row,
//               sn: serialNumbers[row] 
//           })

//         //Colocar o SN no parametro tia do Isac
//         const params = `id=${items.rows[row].id}&serial=${objPatrimonio.serial}&id_fornecedor=${objPatrimonio.id_fornecedor}&id_mac=&serial_fornecedor=${serialNumbers[row]}&id_almoxarifado=${objPatrimonio.id_almoxarifado}&id_filial=${objPatrimonio.id_filial}&numero_nf=${objPatrimonio.numero_nf}&id_produto=${objPatrimonio.id_produto}&valor_bem=${objPatrimonio.valor_bem}&descricao=${objPatrimonio.descricao}&departamento_id=${objPatrimonio.departamento_id}&responsavel_id=${objPatrimonio.responsavel_id}&data_aquisicao=${objPatrimonio.data_aquisicao}&valor_residual=${objPatrimonio.valor_residual}&situacao=${objPatrimonio.situacao}&estado=${objPatrimonio.estado}&id_movimento_produto=${objPatrimonio.id_movimento_produto}&validacao_form_patrimonio=form_patrimonio`
//         const opt = {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }, 
//             body: params
//         }
  
//         let atualizaPatrimonio = await fetch(`${url}/patrimonio/action/action.php?action=edit&id=${items.rows[row].id}`, opt);
//         atualizaPatrimonio = await atualizaPatrimonio.json()
//         console.log(atualizaPatrimonio)
//         //Verificar se a resposta foi aceita 
//     }
   
// }
    