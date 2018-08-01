document.addEventListener("DOMContentLoaded", function() {
  console.log("connected")
  Player.getPlayers()
  Card.chooseFive()

})

//    F E T C H   R E Q U E S T S     //

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

function getPlayers(){
  return fetch(`http://127.0.0.1:3000/players/`,{
    method: "GET",
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
  }).then(response => response.json())
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

function getOnDeckCardContainer(){
  return document.getElementById('on-deck-card-container')
}

function getOnDeckCardMoveContainer(){
  return document.getElementById('on-deck-card-move')
}

function getSquare(x, y) {
  return document.getElementById(`${x}-${y}`)
}


//     E V E N T   H A N D L E R S     //
function selectMove(e){
  const pieceLocation = {x: parseInt(e.path[0].dataset.pieceX), y: parseInt(e.path[0].dataset.pieceY)};
    //waiting on logic
    console.log(e);
    debugger;
}
//--------hover function for card buttons on
function hoverMove(e){
  event.stopPropagation();

  const pieceLocation = {x: parseInt(e.path[0].dataset.pieceX), y: parseInt(e.path[0].dataset.pieceY)};
  const moveX = parseInt(e.target.dataset.x);
  const moveY = parseInt(e.target.dataset.y);
  const potentialMove = getBoardSquare(pieceLocation.x + moveX, pieceLocation.y + moveY)
  potentialMove.classList.add('move')

}
//----------hover function for card buttons off
function hoverOff(e){
  const pieceLocation = {x: parseInt(e.path[0].dataset.pieceX), y: parseInt(e.path[0].dataset.pieceY)};
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



  //addevent listenener
  document.getElementById(`${e.target.dataset.color}-card-1`).addEventListener("click", activateCard)
  document.getElementById(`${e.target.dataset.color}-card-2`).addEventListener("click", activateCard)
}


//     H E L P E R S     //



function initializePlayerIndication(color) {
  let indicatorBar = document.querySelector("#indicator-bar")
  indicatorBar.classList.toggle("red")
  indicatorBar.classList.toggle("blue")

  indicatorBar.classList.toggle(color)
  indicatorBar.innerHTML = `<h3>${color} player go!</h3>`
}

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
  buttonContainer.innerHTML = '';

  //clears old text from options field
  for( let span of e.currentTarget.firstElementChild.children){
    span.innerText ='';
  }
  buttonContainer.innerHTML = 'Valid moves for this piece: <br> (click to refresh) <br>'

  getCard(buttonContainer.dataset.cardId).then(card =>{
    let validMoveCounter = 1;

    //evaluate moves validity
    for(const move of card.moves){
        let moveX = move.x;
        let moveY = move.y;
      if(color === 'blue'){
        moveX = move.x * -1;
        moveY = move.y * -1;
      }

      if(moveX + parseInt(buttonDataSet.x) <= 4 && moveX + parseInt(buttonDataSet.x) >= 0){

        if(moveY + parseInt(buttonDataSet.y) <= 4 && moveY + parseInt(buttonDataSet.y)){
        const destinationX = moveX + parseInt(buttonDataSet.x); 
        const destinationY = moveY + parseInt(buttonDataSet.y);
        if(getSquare(destinationX, destinationY).dataset.color != color){
                 
          //create button
          const square = document.getElementById(`${color}-${cardNumber}-${move.id}`);
          square.innerText = validMoveCounter;
          const moveButton = document.createElement('button')
           //add dataset values for event listener access to move
            moveButton.dataset.x = moveX;
            moveButton.dataset.y = moveY;
            moveButton.dataset.pieceX = buttonDataSet.x;
            moveButton.dataset.pieceY= buttonDataSet.y;
            moveButton.dataset.pieceRank = buttonDataSet.rank;
            moveButton.dataset.cardId = card.id;

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





// can this move to cards.js at some point?
function createCard(cardId, color, cardContainerNumber){
    getCard(cardId).then(card => {
      const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
        if(color === "on-deck"){
          newCard.moveBoard()
        }else{
          const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
          getPlayerCardTitle(color,cardContainerNumber).innerText = newCard.title;
          getPlayerCardQuote(color,cardContainerNumber).innerText = newCard.quote;
          newCard.cardMoveDisplay(color, cardContainerNumber)
          getPlayerCard(color,cardContainerNumber).dataset.cardId = card.id;
        }
    })
}

function getAllBoardPieces() {
  let allBoardChildren = Array.from(document.querySelector("#board").children)
  let pieces = []
  allBoardChildren.forEach(child => {
    if (child.dataset.id) {
      pieces.push({"id": child.dataset.id, "coordinates": child.id, "color": child.dataset.color, "rank": child.dataset.rank})
    }
  })
  return pieces
}





//     W I N   C O N D I T I O N   H E L P E R S     //
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

function winBySenseiPlacement() {
  let pieces = getAllBoardPieces()
  pieces.forEach(piece => {
    if (piece.rank === "sensei") {
      if (piece.color === "red" && piece.coordinates === "4-2") {
        console.log("red wins")
      } else if (piece.color === "blue" && piece.coordinates === "0-2") {
        console.log("blue wins")
      } else {
        console.log("still good")
      }
    }
  })
}

//     F E T C H   P A T C H E S     //

// active player, piece [x, y, on_board], card player_id

//     C H A N G E   P L A Y E R     //

// √change the player indication, show piece buttons for other player, rotate cards?


function changePlayerIndication() {
  let indicatorBar = document.querySelector("#indicator-bar")
  indicatorBar.classList.toggle("red")
  indicatorBar.classList.toggle("blue")
  indicatorBar.innerHTML = ""
}
