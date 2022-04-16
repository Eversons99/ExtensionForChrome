//Roda no background do  navegador

//Recebe a mensagem do script do popup

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({contentBtn: "Processando..."})
        let allSNs = request.sns
        inputSN(allSNs)
    }
);

//Pega tabela com o registros
function getTable(){
    //let tableMain =  document.getElementById('grid_1').childNodes[0]
    let tableMain =  document.querySelector('tbody').childNodes
    //let countRegister = tableMain.childNodes
  
    return tableMain
}
  
//insere os SNS e salva
async function inputSN(allSNs){
    
    loadingAnimation()
    const arraySns = allSNs
    let updateRegister = getTable()
    let totalOfPages = Math.ceil(arraySns.length / updateRegister.length)
    
    for(let i = 0; i < totalOfPages; i++) {
        for(let i in arraySns){
    
            if(i < updateRegister.length){

                let newUpdateRegister = getTable()
                newUpdateRegister[i].dispatchEvent(new MouseEvent ('dblclick', {bubble: true}))
                const serialNumber = document.getElementById('serial_fornecedor')
                await sleep(3)
                serialNumber.value = arraySns[i] 
                await sleep(3)
                saveChange()
                await sleep(3)
            }
            if( i >= updateRegister.length){
                const nextBtn = document.querySelector(".fa-forward").click()
                arraySns.splice(0, updateRegister.length)
                await sleep(2)
                break
            }
        }  
    }

    loadingAnimation(false)
    chrome.runtime.sendMessage({newTextContent: "Nova inserção"})
    
    /*
    loadingAnimation()
    const arraySns = allSNs
    let countRegister = getTable()
    let totalOfPages = Math.ceil(arraySns.length / countRegister.length)
    console.log(totalOfPages)
    
    for(let i = 0; i < totalOfPages; i++) {
        //Atualizando a tabela
        let countRegister = getTable()
  
        for(let y in arraySns){
            if(y <= countRegister.length){
                let countRegister = getTable()
                countRegister[y].dispatchEvent(new MouseEvent ('dblclick', {bubble: true}))
                const serialNumber = document.getElementById('serial_fornecedor')
                await sleep(2)
                serialNumber.value = arraySns[y] 
                await sleep(2)
                saveChange()
                await sleep(2)
            }
  
            if (y >= countRegister.length){
                let nextBtn = document.querySelector(".fa-forward").click()  
                arraySns.splice(0, 30)    
                break;
            }
        }  
    }

    loadingAnimation(false)
    chrome.runtime.sendMessage({newTextContent: "Nova inserção"})
    */
}
  
//Salva as alterações e troca fecha a pagina
function saveChange(){
    setTimeout(() => {
        const btnSave = document.querySelector('.disab')
        //btnSave.click()

        const btnClose = document.querySelectorAll('.fa-times')[2]
        btnClose.click()
     }, 1000)
}
  
//Função "Cronometro"
async function sleep(time){
    return new Promise(function (resolve, reject){
        setTimeout(() => {  
            resolve()
        }, time * 1000)
         
    })
}

// Cria animação de carregamento
function loadingAnimation(isActive = true) {

    // Verifica se o parâmetro is active é true. Se sim, inicia a animação
    if (isActive == true) {

        // Salva body em uma variável, cria uma div #modal-container 
        const body = document.querySelector('body')
        const divModalContainer = document.createElement('div')
        divModalContainer.setAttribute('class', 'modal-container')
        divModalContainer.setAttribute('id', 'modal-container')

        // Cria uma div dentro da #modal-container
        const divModal = document.createElement('div')
        divModal.setAttribute('class', 'modal')

        // Cria h1
        const loading = document.createElement('h1')
        loading.textContent = 'Carregando resultados'

        // Cria span para a moldura o quadro
        const loader = document.createElement('span')
        loader.setAttribute('class', 'loader')

        // Cria ooutro span para preencher o quadro
        const innerLoader = document.createElement('span')
        innerLoader.setAttribute('class', 'loader-inner')

        // Insere um no outro
        loader.append(innerLoader)

        // Insere a div dentro da div modal, e a div modal na div modal container
        divModal.append(loading, loader)
        divModalContainer.append(divModal)
        body.append(divModalContainer)
    }

    // Se falso, deleta a div modal-container
    if (isActive == false) {
        const body = document.querySelector('body')
        body.removeChild(document.getElementById('modal-container'))
    }
}
