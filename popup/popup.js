// Este arquivo interage com o html do popup

const btn = document.getElementById('prosseguir')
btn.addEventListener("click", getSerialNumber)

function getSerialNumber(){
    const inputSNs =  document.getElementById('AllSNs').value

    if (inputSNs.length <= 0) return alert("Por gentileza insira os SNs no campo acima para prosseguir")
  
    const allSNs = inputSNs.split("\n")
        
    allSNs.forEach((sn, index) => {
        if(sn == ''){
            allSNs.splice(index, 1)
        }
    })

    //Encaminha uma mensagem para outra parte do meu projeto contendo o array de dados já tratado
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {sns: allSNs}, function(response) {
            const contentBtn = response.contentBtn
            awaitProcessing(contentBtn)
          })
    })

}

function awaitProcessing(contentBtn){
    //Escondendo os botões
    document.getElementsByTagName('textarea')[0].style.display = 'none'
    document.getElementById('prosseguir').textContent = contentBtn

    //Criando o novo botão para substituir
    const divButton = document.querySelector('.btn')
    const newBtn = document.createElement('button') 
    const btnMain = document.getElementById('prosseguir')
    newBtn.setAttribute('class', 'home-button')
    newBtn.setAttribute('id', 'newInsert')
    btnMain.disabled = true

    chrome.runtime.onMessage.addListener(
    function(request) {
        const myData = request.newTextContent
        newBtn.textContent = myData
        divButton.append(newBtn)
        btnMain.style.display = 'none'
    }
)

    newBtn.addEventListener("click", ()=>{
        const textarea = document.getElementsByTagName('textarea')[0]
        const btnMain = document.getElementById('prosseguir')
        btnMain.textContent = 'Prosseguir'
        textarea.style.display = 'flex'
        textarea.value = ''
        btnMain.textContent = "Prosseguir"
        btnMain.style.display = 'flex'
        newBtn.style.display = 'none'
        btnMain.disabled = false
    })

}



/*
Exemplo de entrada de dados

7898951027901
7898951027902
7898951027903
7898951027904
7898951027905
7898951027906
7898951027907
7898951027908
7898951027909
7898951027910
7898951027911
7898951027912
7898951027913
7898951027914
7898951027915
7898951027916
7898951027917
7898951027918
7898951027919
7898951027920
7898951027921
7898951027922
7898951027923
7898951027924
7898951027924
7898951027926
7898951027927
7898951027928
7898951027929
7898951027930
7898951027931
7898951027932
7898951027933
7898951027934
7898951027935
7898951027936
*/