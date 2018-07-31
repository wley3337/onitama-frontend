document.addEventListener("DOMContentLoaded", function() {
  console.log("connected")
  Piece.fetchPieces()
  Card.chooseFive()
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

function activateCard(e) {
  
  //gets dataset information of current piece
  const pieceButtonArray = e.currentTarget.parentElement.children["0"].childNodes
  let buttonDataSet;
  for(let button of pieceButtonArray){
     if(button.dataset.clicked === 'true'){
       buttonDataSet = button.dataset
      }
    }

 //toggle buttons back on
  const color = e.currentTarget.id.split("-")[0];
  const cardNumber = e.currentTarget.id.split("-")[2];
  const buttonContainer = document.getElementById(`${color}-card-${cardNumber}-buttons`)
  buttonContainer.classList.toggle("hidden");
  getCard(buttonContainer.dataset.cardId).then(card =>{
    let validMoveCounter = 1;
 
    //evaluate moves validity 
    for(const move of card.moves){
    
      if(color === 'blue'){
        move.x = move.x * -1;
        move.y = move.y * -1;
      }
      console.log(buttonDataSet.x, buttonDataSet.y)
      if(move.x + parseInt(buttonDataSet.x) <= 4 && move.x + parseInt(buttonDataSet.x) >= 0){
        if(move.y + parseInt(buttonDataSet.y) <= 4 && move.y + parseInt(buttonDataSet.y)){
          
          //create button
          const square = document.getElementById(`${color}-${cardNumber}-${move.id}`);
          square.innerText = validMoveCounter;
          const moveButton = document.createElement('button')
           //add dataset values for event listener access to move
            moveButton.dataset.x = move.x;
            moveButton.dataset.y = move.y;

             //label button
            moveButton.innerText = validMoveCounter;
            validMoveCounter++;
            //render button to screen

          buttonContainer.appendChild(moveButton)

           //click event listener
            buttonContainer.lastChild.addEventListener('click', selectMove)
            //hover event listeners
            buttonContainer.lastChild.addEventListener('mouseover', hoverMove)
            buttonContainer.lastChild.addEventListener('mouseout', hoverOff)
        }
      }
      
    }
  })
  
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

function winningConditions() {

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

// function showActivePlayer() {
//   fetch(`http://localhost:3000/players`)
//   .then(resp => resp.json())
//   .then(players => {
//     player.
//   })
// }
