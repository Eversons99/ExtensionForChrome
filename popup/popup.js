

//Quando o cliente clicar no botão prosseguir
function testeFunction(){
    console.log('a')
    const inputSNs =  document.getElementById('AllSNs').value
    const btn = document.getElementById('prosseguir')
    if(inputSNs.lenght == 0){
        alert("O input esta vazio")
    }else(
        alert(`O input tem o valor de ${inputSNs}`)
    )
}