// Este arquivo interage com o html do popup

const btn = document.getElementById('prosseguir')
btn.addEventListener("click", getSerialNumber)

function getSerialNumber(){

    const nf = document.getElementById('nf').value
    const confirmSelect = document.querySelector('#mySelect').value
    if(!nf) return alert("O campo não aceita letras e não pode estar vazio")
    if(confirmSelect == '') return alert("Selecione algum modelo de equipamento")


    document.querySelector('.main').style.display = 'none'
    document.querySelector('.serial-Number').style.display = 'block'

    
    const btn2 = document.getElementById('prosseguir2')
    btn2.addEventListener("click", ()=>{
        const equipamentModel = document.getElementById('mySelect').value
        const inputSNs = document.getElementById('AllSNs').value
        if (inputSNs.length <= 0) return alert("O campo acima não pode estar vazio")
  
        const allSNs = inputSNs.split("\n")
        allSNs.forEach((sn, index) => {
            if(sn == ''){
                allSNs.splice(index, 1)
            }
        })
        
        //Encaminha uma mensagem para outra parte do meu projeto contendo o array de dados já tratado
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {sns: allSNs, NF: nf, equipament: equipamentModel}, function(response){
                const contentBtn = response.contentBtn
                console.log(contentBtn)
                awaitProcessing(contentBtn)
            })
        });
    })
}



function awaitProcessing(contentBtn){
    //Escondendo os botões
    const myTextarea = document.querySelector('textarea').style.display = 'none'
    myTextarea.value = ''

    const myBtn = document.getElementById('prosseguir').textContent = contentBtn

   

}

chrome.runtime.onMessage.addListener(
    function(response) {
        console.log(response.dataSucess)
        console.log(response.dataError)
    }
  );



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