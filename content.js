//Este é o unico arquivo que consegue interagir e alterar dados da pagina web
//Pega os Inputs
function getInputSNs(){
    const inputSNs =  document.getElementById('AllSNs').value
    console.log(inputSNs)
    const splitSN = inputSNs.split("\n")
    
    splitSN.forEach((sn, index) => {
        if(sn == ''){
            console.log(index)
            splitSN.splice(index, 1)
        }
    })
    console.log(splitSN)
    inputSN(splitSN)
    
  }
  
  //Pega tabela com o registros
  function getTable(){
    let tableMain =  document.getElementById('grid_1').childNodes[0]
    console.log(tableMain)
    let countRegister = tableMain.childNodes
  
    return countRegister
  }
  
  //insere os SNS e salva
  async function inputSN(splitSN){
  
    const arraySns = splitSN
  
    console.log(arraySns + " AAAQUI")
    /*let arraySns = [
        7898951027921, 
        7898951027922, 
        7898951027923, 
        7898951027924, 
        7898951027925, 
        7898951027926, 
        7898951027927, 
        7898951027928, 
        7898951027929
    ]*/
    
    let totalOfPages = Math.ceil(arraySns.length / 30)
    
    for(let i = 0; i < totalOfPages; i++) {
        console.log("Entrei")
        //Atualizando a tabela
        let countRegister = getTable()
  
        console.log(arraySns.length + " Depois" )
        console.log(arraySns)
        for(let y in arraySns){
            console.log(y)
            if(y <= 29){
                let countRegister = getTable()
                countRegister[y].dispatchEvent(new MouseEvent ('dblclick', {bubble: true}))
                const serialNumber = document.getElementById('serial_fornecedor')
                console.log(serialNumber)
                await sleep(2)
                serialNumber.value = arraySns[y] 
                console.log(serialNumber)
                await sleep(1)
                saveChange()
                await sleep(1)
            }
  
            if (y >= 30){
                let nextBtn = document.querySelector(".fa-forward").click()  
                arraySns.splice(0, 30)    
                break;
            }
        }  
    }
  }
  
  //Salva as alterações e troca fecha a pagina
  function saveChange(){
    setTimeout(() => {
        const btnSave = document.querySelector('.disab')
        //btnSave.click()
            
        //Fechar
        const btnClose = document.querySelectorAll('.fa-times')[2]
        btnClose.click()
     }, 1000)
  }
  
  //Função "Cronometro"await sleep(2)
  async function sleep(time){
    return new Promise(function (resolve, reject){
        setTimeout(() => {  
            resolve()
        }, time * 1000)
         
    })
  }
  
  document.getElementById("prosseguir").addEventListener("click", getInputSNs);
  
/*
alert("Estou no ixcholas")

function testeClickCadastros(){
    let btnSave = document.querySelector('.submenu_title')
    btnSave.click()
    console.log(btnSave)
}
testeClickCadastros()
*/