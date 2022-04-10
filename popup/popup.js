// Este arquivo nterage com o html do popup

const btn = document.getElementById('prosseguir')
btn.addEventListener("click", getSerialNumber)

function getSerialNumber(){
    const inputSNs =  document.getElementById('AllSNs').value

    if (inputSNs.length <= 0) return alert("Por gentileza insira os SNs no campo acima para prosseguir")
  
    //Chamada da função que envia os SNs para o content.js
    console.log("Tudo validado, vamos prosseguir")
    console.log(inputSNs)
    const allSNs = inputSNs.split("\n")
        
    allSNs.forEach((sn, index) => {
        if(sn == ''){
            allSNs.splice(index, 1)
            }
        })

    chrome.runtime.sendMessage("Helo World")
}
    




/**
Exemplo de entrada de dados

7898951027921
7898951027922
7898951027923
7898951027924
7898951027925
7898951027926
 */