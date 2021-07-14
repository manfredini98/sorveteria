import { dados } from './dados.js'
import { pedido } from './moeda.js'
import { handleUpdateOrderItemEvent } from './pedido.js'

window.onload = function() {
  const categorias = document.querySelectorAll('.item-menu')

  
  function criarListaDeProdutos(id, nome, preco, imagem) {
    const moeda = pedido(preco)
  
    return `
      <li data-id="${id}">
        <a class="lista-menu" href="#">
          <div class="lista-img">
            <img src="${imagem}" alt="">
          </div>
          <span class="lista-nome">${nome}</span>
          <span class="lista-preco">${moeda}</span>
        </a>
      </li>
    `
  }


  function produtosLista(categoriaSelecionada = '') {
    const cardapio = document.querySelector('.menu-lista')
  
    const listarprodutos = dados.reduce
      (function (acumulator, { id, nome, preco, imagem, categoria }) {
        if (!categoriaSelecionada || categoriaSelecionada === 'all') {
            acumulator += criarListaDeProdutos(id, nome, preco, imagem)
        }
        
        if (categoriaSelecionada === categoria) {
            acumulator += criarListaDeProdutos(id, nome, preco, imagem)
        }
        return acumulator
      }, '')
        
    cardapio.innerHTML = listarprodutos

   
    handleUpdateOrderItemEvent(document.querySelectorAll('.menu-lista li'))
  }

  
  categorias.forEach(categoria => {
    categoria.addEventListener('click', (event) => {
      const categoriaSelecionada = event.currentTarget.dataset.categorias

     
      categorias.forEach(item => {
        item.classList.remove('ativo')
      })

     
      categoria.classList.add('ativo')

      
      produtosLista(categoriaSelecionada)
    })
  })

  
  produtosLista()
}