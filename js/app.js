//Vars
let boardArray = []
let usedPieces  =  []
let player = true //p1 = true, p2 = false
let flag = true
let select = true

//Cached Elements________________
let message = document.getElementById('msg')
let redBank = document.getElementById('red-bank')
let blueBank = document.getElementById('blue-bank')
let overlay = document.getElementById('overlay')
let board = document.getElementById('board')
let replay = document.getElementById('replay')
let body = document.querySelector('body')


//Classes _________________________________
class Game {
  constructor(){
    this.init()
    this.constructPiecesArray()
    this.constructBoard()
    this.constructOverlay()
  }

  init(){ 
    message.innerHTML= '<span class ="p1">Player 1</span> select a piece for <span class ="p2">Player 2</span>'
    replay.style.visibility= 'hidden'
  }

  clear(){
    boardArray.forEach(el => { //restore board
      el.removeAttribute('class') 
      //console.log(el)
      el.classList.add('cell')
      critArray.forEach(crit=> {
        el.pieceInfo[crit] = 'none' 
      })
    })
    usedPieces.forEach(piece=> { //restore bank
      piece.style.visibility = 'visible'
      piece.classList.remove('active') 
    })
    console.log('usedPieces')
    console.log(usedPieces)
    usedPieces = []
    console.log(boardArray)
    game.init()
  }

  constructPiecesArray(){
    for(let i=0; i<8; i++){
      let piece = new Piece(pieceInfoArray[i])
      this.stylePieces(piece)
      redBank.appendChild(piece.div)
    }
    for(let i=8; i<16; i++){
      let piece = new Piece(pieceInfoArray[i])
      this.stylePieces(piece)
      blueBank.appendChild(piece.div)
    }
  }

  stylePieces(piece){
    for(let i=0; i<3; i++){
      if(i===0){
        if(piece.div.pieceInfo.color === 'dark'){ 
          if(piece.div.pieceInfo.top === 'flat'){
            piece.div.classList.add('dark-flat') 
          }else{ 
            piece.div.classList.add('dark-indent')
          }
        }else{ 
          if(piece.div.pieceInfo.top === 'flat'){
            piece.div.classList.add('light-flat') 
          }else{
            piece.div.classList.add('light-indent') 
          }
        }  
      }if(i===1){
        piece.div.pieceInfo.height === 'tall' ? piece.div.classList.add('tall') : piece.div.classList.add('short')
      }if(i===2){
        piece.div.pieceInfo.shape === 'circle' ? piece.div.classList.add('circle') : piece.div.classList.add('square')
      }
    }
  }

  constructOverlay(){
    for(let i=0; i<16; i++){
      let cell = new Cell(new PieceInfo('none', 'none', 'none', 'none'))
      boardArray.push(cell.div)
      overlay.appendChild(cell.div)
      cell.div.classList.add('cell')
    }
  }

  constructBoard(){
    for(let i=0; i<16; i++){
      let boardCell = document.createElement('div')
      boardCell.classList.add('boardCell') 
      board.appendChild(boardCell)
    }
  }

  setActivePiece(activePiece){
    this.activePiece = activePiece
  }

  setUsedPiece(usedPiece){
    this.usedPiece = usedPiece
    usedPieces.push(this.usedPiece)
  }

  checkWin(){
    foursArray.forEach((array) =>{
      critArray.forEach(crit =>{
        if(
          boardArray[array[0]].pieceInfo[crit] === boardArray[array[1]].pieceInfo[crit] && 
          boardArray[array[1]].pieceInfo[crit] === boardArray[array[2]].pieceInfo[crit] && 
          boardArray[array[2]].pieceInfo[crit] === boardArray[array[3]].pieceInfo[crit] &&
          boardArray[array[0]].pieceInfo[crit] !== 'none' && 
          boardArray[array[1]].pieceInfo[crit] !== 'none' && 
          boardArray[array[2]].pieceInfo[crit] !== 'none' && 
          boardArray[array[3]].pieceInfo[crit] !== 'none'
          ){
            this.displayWin()
        }
      })
    })
  }

  checkTie(){
    if(usedPieces.length === 16){
      message.innerHTML  =  "It's a tie!"
      replay.style.visibility= 'visible'
      replay.addEventListener('click', this.clear)
      confetti.start(4000)
    }
  }

  displayWin(){
    flag = false
    console.log(boardArray)
    if(player){
      message.innerHTML = '<span class ="p1">Player 1</span> wins!' 
    }else{
      message.innerHTML = '<span class = "p2">Player 2</span> wins!'
    }
    replay.style.visibility= 'visible'
    replay.addEventListener('click', this.clear)
    confetti.start(4000)
  }
  removeFromBank(){
    game.setUsedPiece(game.activePiece)
    game.usedPiece.style.visibility =  'hidden'
  }
  
  displayMessage(){
    player ? message.innerHTML = '<span class ="p1">Player 1</span> select a piece for <span class ="p2">Player 2</span>' : message.innerHTML = '<span class ="p2">Player 2</span> select a piece for <span class ="p1">Player 1</span>'
  }
}

class Piece {
  constructor(pieceInfo){ //'this' refers to piece
    this.div = document.createElement('div')
    this.div.pieceInfo = pieceInfo
    this.div.addEventListener('click', this.select)
  }
  select(){ //'this' refers to piece.div
      if(!flag){ //if placed, switch turns
        player = !player
      }else{ //if not placed, remove styling from last and set new active piece
        console.log(game.activePiece)
        if(game.activePiece){
          game.activePiece.classList.remove('active')
        } 
        game.setActivePiece(this)
        this.classList.add('active')
        console.log('active piece')
        console.log(this)
      }
      player ? message.innerHTML = '<span class="p1">Player 1</span> place selected' : message.innerHTML = '<span class="p2">Player 2</span> place selected'
      flag = true
  }
}


class Cell {
  constructor(pieceInfo){ //'this' refers to cell
    this.div = document.createElement('div')
    this.div.pieceInfo = pieceInfo
    this.div.addEventListener('click', this.placeOnBoard)
  }
  placeOnBoard(){ //'this' refers to cell.div
    console.log('clicked')
    console.log(flag)
    console.log(this)
    if(select === true){ //prohibit player from placing to the board before another piece is selected
      if(this.pieceInfo.color === 'none'){ //if cell is empty
        flag = false 
        this.className = game.activePiece.classList 
        this.pieceInfo = game.activePiece.pieceInfo 
        this.classList.remove('active')  
        game.removeFromBank()
        game.displayMessage()
      }
      game.checkWin()
      game.checkTie()
    }
  }
}

class PieceInfo {
  constructor(color, height, top, shape){
    this.color = color
    this.height = height 
    this.top = top 
    this.shape = shape
  }
}

//Consts_________________________________ 
const critArray = ['color', 'height', 'top', 'shape']

const pieceInfoArray = [
  new PieceInfo('dark', 'short', 'flat', 'circle'),
  new PieceInfo('dark', 'short', 'flat', 'square'),
  new PieceInfo('dark', 'short', 'indent', 'circle'),
  new PieceInfo('dark', 'short', 'indent', 'square'),
  new PieceInfo('dark', 'tall', 'flat', 'circle'),
  new PieceInfo('dark', 'tall', 'flat', 'square'),
  new PieceInfo('dark', 'tall', 'indent', 'circle'),
  new PieceInfo('dark', 'tall', 'indent', 'square'),
  new PieceInfo('light', 'short', 'flat', 'circle'),
  new PieceInfo('light', 'short', 'flat', 'square'),
  new PieceInfo('light', 'short', 'indent', 'circle'),
  new PieceInfo('light', 'short', 'indent', 'square'),
  new PieceInfo('light', 'tall', 'flat', 'circle'),
  new PieceInfo('light', 'tall', 'flat', 'square'),
  new PieceInfo('light', 'tall', 'indent', 'circle'),
  new PieceInfo('light', 'tall', 'indent', 'square'),
]

const foursArray = [
  [0, 1, 2, 3],  //horizontals
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12], //verticals
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],  //diagonals
  [3, 6, 9, 12],
]

var game = new Game()
