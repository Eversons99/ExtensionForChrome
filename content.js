//Roda no background do  navegador

//Recebe a mensagem do script do popup
chrome.runtime.onMessage.addListener(function(request) {
    console.log(request.sns)
    let allSNs = request.sns
    
    if(allSNs.length == 0) return alert("Nenhum dado foi inserido")
    
    inputSN(allSNs)
})

//Pega tabela com o registros
function getTable(){
    let tableMain =  document.getElementById('grid_1').childNodes[0]
    let countRegister = tableMain.childNodes
  
    return countRegister
}
  
//insere os SNS e salva
async function inputSN(splitSN){
  
    const arraySns = splitSN
  
    let totalOfPages = Math.ceil(arraySns.length / 30)
    
    for(let i = 0; i < totalOfPages; i++) {
        //Atualizando a tabela
        let countRegister = getTable()
  
        for(let y in arraySns){
            if(y <= 29){
                let countRegister = getTable()
                countRegister[y].dispatchEvent(new MouseEvent ('dblclick', {bubble: true}))
                const serialNumber = document.getElementById('serial_fornecedor')
                await sleep(2)
                serialNumber.value = arraySns[y] 
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