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
        chrome.tabs.sendMessage(tabs[0].id, {sns: allSNs});
    });
}

/*
Exemplo de entrada de dados

7898951027921
7898951027922
7898951027923
7898951027924
7898951027925
7898951027926
*/