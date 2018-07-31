document.addEventListener("DOMContentLoaded", function() {
  console.log("connected")
  Piece.fetchPieces()
  Card.chooseFive()
  initializePlayerIndication("Red")
})

//    F E T C H   R E Q U E S T S

function getCard(cardId){
   return fetch('http://127.0.0.1:3000/cards/'+ cardId, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(response => response.json());
}


//    G E T    D O M    E L E M E N T S    //
function getPlayerCard(color,num){
    return document.getElementById(`${color}-card-${num}`)
}

function getPlayerCardTitle(color,num){
    return document.getElementById(`${color}-card-${num}-title`)
}

function getPlayerCardQuote(color,num){
    return document.getElementById(`${color}-card-${num}-quote`)
}

function getPlayerCardButtons(color,num){
    return document.getElementById(`${color}-card-${num}-buttons`)
}

function getBoardSquare(x,y){
    return document.getElementById(`${x}-${y}`)
}


//     E V E N T   H A N D L E R S     //
function selectMove(e){
    //waiting on logic
    console.log(e);
    debugger;
}
//--------hover function for card buttons on
function hoverMove(e){
  event.stopPropagation();
  const pieceLocation = {x: 3, y: 2}
  const moveX = parseInt(e.target.dataset.x);
  const moveY = parseInt(e.target.dataset.y);
  const potentialMove = getBoardSquare(pieceLocation.x + moveX, pieceLocation.y + moveY)
  potentialMove.classList.add('move')

}
//----------hover function for card buttons off
function hoverOff(e){
  const pieceLocation = {x: 3, y: 2}
  const moveX = parseInt(e.target.dataset.x);
  const moveY = parseInt(e.target.dataset.y);
  const potentialMove = getBoardSquare(pieceLocation.x + moveX, pieceLocation.y + moveY)
  potentialMove.classList.remove('move')

}

// This is where the start of the play happens?
function pieceButtonClickHandler(e) {
  let square = getSquare(e.target.dataset.x, e.target.dataset.y)
  let siblingButtons = Array.from(e.target.parentElement.children)

  undoLeftoverHighlight(siblingButtons)

  square.classList.toggle(`${e.target.dataset.color}`)
  square.classList.toggle(`highlight`)
  e.target.dataset.clicked = true

  document.getElementById(`${e.target.dataset.color}-card-1`).addEventListener("click", activateCard)
  document.getElementById(`${e.target.dataset.color}-card-2`).addEventListener("click", activateCard)
}


//     H E L P E R S     //

function changePlayerIndication() {
  let indicatorBar = document.querySelector("#indicator-bar")
  indicatorBar.classList.toggle("red")
  indicatorBar.classList.toggle("blue")
  indicatorBar.innerHTML = ""
}

function initializePlayerIndication(color) {
  let indicatorBar = document.querySelector("#indicator-bar")
  indicatorBar.classList.add("red")
  indicatorBar.innerHTML = `<h3>${color} Player Go!</h3>`
}

function activateCard(e) {
  console.log(e)
  debugger
}

function undoLeftoverHighlight(siblings) {
  siblings.forEach(button => {
    if (button.dataset.clicked === "true") {
      button.dataset.clicked = false
      let thisSquare = getSquare(button.dataset.x, button.dataset.y)
      thisSquare.classList.toggle(`highlight`)
      thisSquare.classList.toggle(`${button.dataset.color}`)
    }
  })
}

function getSquare(x, y) {
  return document.getElementById(`${x}-${y}`)
}

function winByClearingOpponents() {
  let red = 0
  let blue = 0
  getAllBoardPieces().forEach(piece => {
    piece.color === "red" ? red+=1 : blue+=1
  })
  if (red === 0) {
    console.log("blue wins")
  } else if (blue === 0) {
    console.log("red wins")
  }
  console.log(`red: ${red}, blue: ${blue}`)
}

// can this move to cards.js at some point?
function createCard(cardId, color, cardContainerNumber){
    getCard(cardId).then(card => {
          const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
          getPlayerCardTitle(color,cardContainerNumber).innerText = newCard.title;
          getPlayerCardQuote(color,cardContainerNumber).innerText = newCard.quote;
          newCard.cardMoveDisplay(color, cardContainerNumber)
    })
}

function getAllBoardPieces() {
  let allBoardChildren = Array.from(document.querySelector("#board").children)
  let pieces = []
  allBoardChildren.forEach(child => {
    if (child.dataset.id) {
      pieces.push({"id": child.dataset.id, "coordinates": child.id, "color": child.dataset.color})
    }
  })
  return pieces
}

// function showActivePlayer() {
//   fetch(`http://localhost:3000/players`)
//   .then(resp => resp.json())
//   .then(players => {
//     player.
//   })
// }
