import { dados } from './dados.js'
import { pedido } from './moeda.js'

function criarListaDeProdutosPedido(id, nome, preco, imagem, quantidade){
  const moeda = pedido(preco * quantidade) 

  return `
    <li class="pedido-item" dados-idpedido="${id}">
      <div class="pedido-img">
        <img src="${imagem}" alt="">
      </div>
      <div class="pedido-texto">
        <span class="pedido-nome">${nome}</span>
        <span class="pedido-preco" dados-preco="${preco}">${pedido(preco)}</span>
      </div>
      <div class="pedido-quantidade">
        <input class="pedido-qtd" type="number" min="1" value="${quantidade}" dados-idproduto="${id}"/>
        <span class="pedido-total" dados-total-preco="${preco * quantidade}">${moeda}</span>
      </div>
    </li>
  `
}


function updateTotalItenspreco() {
  let totalpreco = 0

  const cestaItens = document.querySelectorAll('.pedido-lista .pedido-item')
  const totalItensprecoSpam = document.querySelector('#total')

 
  cestaItens.forEach(item => {
    const pedidoSpanTotal = item.querySelector('span.pedido-total')
    const currentOrderTotalpreco = Number(pedidoSpanTotal.getAttribute('dados-total-preco'))

    totalpreco += currentOrderTotalpreco
  })

  totalItensprecoSpam.innerHTML = pedido(totalpreco)
}


function updateItemTotalpreco(itemId, newpreco){
  const itemInCart = document.querySelector(`[dados-idpedido="${itemId}"]`)
  const pedidoTotalSpan = itemInCart.querySelector('span.pedido-total')
  
  pedidoTotalSpan.innerHTML = pedido(newpreco)
  pedidoTotalSpan.setAttribute('dados-total-preco', newpreco)

  
  updateTotalItenspreco()
}


function updateItensInputCartEvent(){
  const cestaItens = document.querySelectorAll('.pedido-list li')

  cestaItens.forEach(item => {
    const pedidoId = Number(item.getAttribute('dados-idpedido'))
    const itempreco = item.querySelector('span.pedido-preco').getAttribute('dados-preco')
    const itemInputQuantity = item.querySelector('input.pedido-qty')
    
    itemInputQuantity.addEventListener("input", (event) => {
      const currentInput = event.currentTarget

      currentInput.setAttribute('value', currentInput.value)

      
      updateItemTotalpreco(pedidoId, Number(itempreco) * currentInput.value)
    })
  })
}


function itensInCartLoader(pedidoData) {
  const pedidoDOM = document.querySelector('.pedido-lista')
  const listProduct = pedidoData.reduce((accumulator, {id, nome, preco, imagem, quantidade}) =>
  accumulator += criarListaDeProdutosPedido(id, nome, preco, imagem, quantidade), '')
  pedidoDOM.innerHTML = listProduct

  
  updateItensInputCartEvent()

 
  updateTotalItenspreco()
}


function insertItemInCart({ id, nome, preco, imagem, quantidade }){
  const pedidoDOM = document.querySelector('.pedido-lista')
  const itemCartHtml = criarListaDeProdutosPedido(id, nome, preco, imagem, quantidade)
  const itemInCart = pedidoDOM.querySelector(`[dados-idpedido="${id}"]`)

  if(itemInCart){
    const quantidadeInput = itemInCart.querySelector('input.pedido-qtd')

    quantidadeInput.value = Number(quantidadeInput.value) + 1
    quantidadeInput.setAttribute('value', quantidadeInput.value)

    updateItemTotalpreco(id, quantidadeInput.value * preco)
  }
  else{
    pedidoDOM.innerHTML += itemCartHtml
  }


  updateItensInputCartEvent()

  updateTotalItenspreco()
}


function handleOrderClick(event){

  const pedidoId = event.currentTarget.dataset.id
  
  const pedidoStorage = JSON.parse(localStorage.getItem('pedido')) || []
  
  const pedidoProductData = dados.find(({ id }) => Number(pedidoId) === id)
  
  const pedidoStorageData = pedidoStorage.find(pedido => pedido.id == pedidoProductData.id)

  if(!pedidoStorageData){
    
    pedidoStorage.push(pedidoProductData)
  }else{
    
    const currentOrderIndexOnData = pedidoStorage.indexOf(pedidoStorageData)
    pedidoStorage[currentOrderIndexOnData].quantidade = pedidoStorage[currentOrderIndexOnData].quantidade + 1
  }

  
  localStorage.setItem('pedido', JSON.stringify(pedidoStorage))
  insertItemInCart(pedidoProductData)
}

export function handleUpdateOrderItemEvent(elements){
  elements.forEach(element => {
    element.addEventListener("click", handleOrderClick)
  })
}


document.querySelector('#pedido-terminar').addEventListener('click', () => {

  localStorage.removeItem('pedido')
  document.querySelector('ul.pedido-lista').innerHTML = ""
  document.querySelector('#total').innerHTML = ""
})


itensInCartLoader(JSON.parse(localStorage.getItem('pedido')) || [])