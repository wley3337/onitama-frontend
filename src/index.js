let promises;

document.addEventListener("DOMContentLoaded", function() {
  console.log("connected")
  Player.getPlayers()
  Card.chooseFive()
  getResetButton().addEventListener('click', resetGame)

})
// C A R D S   I N   C U R E N T  G A M E//
const store = {cards:[]};

//    F E T C H   R E Q U E S T S     //

function getCard(cardId){
  //  return fetch('https://enigmatic-dusk-38753.herokuapp.com/cards/'+ cardId, {
   return fetch('http://127.0.0.1:3000/cards/'+ cardId, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(response => response.json());
}

function resetGame(){
  // fetch('https://enigmatic-dusk-38753.herokuapp.com/players/reset',{
  fetch('http://localhost:3000/players/reset',{
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers:{
      "Content-Type": "application/json; charset=utf-8"
    },
  }).then(resp => {
    clearAllBoardPieces()
    clearAllPieceButtons("red")
    Player.getPlayers()
  })
}

function fetchPlayers(){

  // return fetch(`https://enigmatic-dusk-38753.herokuapp.com/players`,{
  return fetch(`http://127.0.0.1:3000/players/`,{
    method: "GET",
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
  }).then(response => response.json())
}

//    G E T    D O M    E L E M E N T S    //
function getResetButton(){
  return document.getElementById(`reset-button`)
}
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

function getPlayerCardMoveContainer(color,num){
  return document.getElementById(`${color}-card-${num}-move`)
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

function getOnDeckCardTitle(){
  return document.getElementById('on-deck-card-title')
}
function getOnDeckCardQuote(){
  return document.getElementById('on-deck-card-quote')
}

function getOnDeckCardButtonContainer(){
  return document.getElementById('on-deck-card-buttons')
}

function getSquare(x, y) {
  return document.getElementById(`${x}-${y}`)
}

function getMoveGridContainer(color,number){
  return document.getElementById(`${color}-card-${number}-move`)
}

function getCardFromStore(id){
  return store.cards.find(card => card.id === id)
}


//     E V E N T   H A N D L E R S     //
function selectMove(e){

  e.stopPropagation();

  //changing cards
  const color = e.target.parentElement.id.split("-")[0]
  const containerNumber = e.target.parentElement.id.split("-")[2]
  const usedCardId = parseInt(e.currentTarget.dataset.cardId);
  const onDeckCardId = parseInt(getOnDeckCardTitle().dataset.cardId);
  const buttonContainer = document.getElementById(`${color}-card-${containerNumber}-buttons`)
  buttonContainer.innerHTML = '';

  getCardFromStore(usedCardId).moveBoard()
  getCardFromStore(onDeckCardId).cardRender(color, containerNumber)


  // piece moving
  const pieceLocation = {x: parseInt(e.path[0].dataset.pieceX), y: parseInt(e.path[0].dataset.pieceY)};
  const pieceMove = {x: parseInt(e.target.dataset.x), y: parseInt(e.target.dataset.y)}
  let moveFromNode = getSquare(pieceLocation.x, pieceLocation.y)
  let moveFromId = parseInt(moveFromNode.dataset.id)
  let moveToNode = getSquare((pieceLocation.x + pieceMove.x), (pieceLocation.y + pieceMove.y))
  let moveToId = moveToNode.dataset.id

  movePiece(moveFromNode, moveToNode)

  if (evaluateWinConditions()) {
    clearAllPieceButtons(moveToNode.dataset.color)
    document.querySelector("#indicator-bar").innerText = evaluateWinConditions()
  } else {

    // T H I S   I S   T H E   P A T C H   S T U F F

    let data1 = {x: (pieceLocation.x + pieceMove.x), y: (pieceLocation.y + pieceMove.y)}

    let promise1 = new Promise(resolve => {
      patchPiece(moveFromId, data1)
      .then(piece => {
        // releasing active player status
        let request
        if (piece.player.id === 1) {
          request = patchPlayerFetch(1, {active_player: false})
        } else if (piece.player.id === 2) {
          request = patchPlayerFetch(2, {active_player: false})
        }
        return request
      })
      .then(player => {
        // transferring active player status
        let request
        if (player.id === 1) {
          request = patchPlayerFetch(2, {active_player: true})
          
        } else if (player.id === 2){
          request = patchPlayerFetch(1, {active_player: true})
        }
        resolve(request)
      })
    })

    let promise2 = new Promise((resolve, reject) => {
      if (moveToId) {
        resolve(patchPiece(moveToId, {on_board: false}))
      }else{
        resolve(console.log("no pawn there"))
      }
    })

    promises = [promise1, promise2]
    Promise.all(promises)
    .then(resp => {
      clearAllBoardPieces()
      clearAllPieceButtons(resp[0].name)
      Player.getPlayers()
    })
  }
}

function patchPiece(id, data) {
  // return fetch(`https://enigmatic-dusk-38753.herokuapp.com/pieces/${id}`, {
  return fetch(`http://localhost:3000/pieces/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(piece => {
    return piece
  })
}

function patchPlayerFetch(id, data) {
  // return fetch(`https://enigmatic-dusk-38753.herokuapp.com/players/${id}`, {
  return fetch(`http://localhost:3000/players/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json; charset=utf-8"},
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(player => {
    // debugger
    return player
  })
}

function clearAllButtonsAndTextFields(){
  getPlayerCardButtons("blue",1).innerHTML ='';
  getPlayerCardButtons("blue",2).innerHTML ='';
  getPlayerCardButtons("red",1).innerHTML ='';
  getPlayerCardButtons("red",2).innerHTML ='';
  clearChildrenText(getMoveGridContainer("red",1));
  clearChildrenText(getMoveGridContainer("red",2));
  clearChildrenText(getMoveGridContainer("blue",1));
  clearChildrenText(getMoveGridContainer("blue",2));
}

function clearChildrenText(node){
  for(let child of node.children){
    child.innerText ="";
  }
}

function movePiece(fromNode, toNode) {
  fromNode.classList.toggle("highlight")
  // fromNode.classList.toggle(`${fromNode.dataset.color}`)
  toNode.classList.toggle("move")
  toNode.classList.toggle(`${fromNode.dataset.color}`)
  toNode.dataset.color = fromNode.dataset.color
  toNode.dataset.id = fromNode.dataset.id
  toNode.dataset.rank = fromNode.dataset.rank

  if (fromNode.dataset.rank === "sensei") {
    fromNode.classList.toggle("sensei")
    toNode.classList.toggle("sensei")
  }
  fromNode.dataset.color = ""
  fromNode.dataset.id = ""
  fromNode.dataset.rank = ""
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

//----hover over player piece
function hoverPieceOn(e){
  event.stopPropagation();
  const x = e.currentTarget.dataset.x;
  const y = e.currentTarget.dataset.y;
  getSquare(x,y).classList.add('move');
}

function hoverPieceOff(e){
  event.stopPropagation();
  const x = e.currentTarget.dataset.x;
  const y = e.currentTarget.dataset.y;
  getSquare(x,y).classList.remove('move');
}


// This is where the start of the play happens?
function pieceButtonClickHandler(e) {
  event.stopPropagation();
  let square = getSquare(e.target.dataset.x, e.target.dataset.y)
  let siblingButtons = Array.from(e.target.parentElement.children)

  square.classList.add(`highlight`)
  undoLeftoverHighlight(siblingButtons)

  square.classList.toggle(`${e.target.dataset.color}`)

  e.target.dataset.clicked = true

  clearAllButtonsAndTextFields();
  //addevent listenener
  document.getElementById(`${e.target.dataset.color}-card-1`).addEventListener("click", activateCard)
  document.getElementById(`${e.target.dataset.color}-card-2`).addEventListener("click", activateCard)

}



//     H E L P E R S     //



function initializePlayerIndication(color) {
  let indicatorBar = document.querySelector("#indicator-bar")
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

    //get card from store
    const cardId = parseInt(buttonContainer.dataset.cardId);
    const card = getCardFromStore(cardId);
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

        if(moveY + parseInt(buttonDataSet.y) <= 4 && moveY + parseInt(buttonDataSet.y) >= 0){
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
}

function undoLeftoverHighlight(siblings) {

  siblings.forEach(button => {
    if (button.dataset.clicked === "true") {
      button.dataset.clicked = false
      let thisSquare = getSquare(button.dataset.x, button.dataset.y)
      thisSquare.classList.remove(`highlight`)
      thisSquare.classList.add(`${button.dataset.color}`)
    }
  })
}





// can this move to cards.js at some point?
function createCard(cardId, color, cardContainerNumber){
    getCard(cardId).then(card => {
      const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
      store.cards.push(newCard);
        if(color === "on-deck"){
          newCard.moveBoard()
        } else {
          const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
          newCard.cardRender(color,cardContainerNumber)
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

function getAllBoardPieceNodes() {
  let allBoardChildren = Array.from(document.querySelector("#board").children)
  let pieces = []
  allBoardChildren.forEach(child => {
    if (child.dataset.id) {
      pieces.push(child)
    }
  })
  return pieces
}

function clearAllBoardPieces() {
  getAllBoardPieceNodes().forEach(piece => {
    piece.classList =""
    if(piece){
      if(piece.id === "0-2" || piece.id === "4-2"){
        piece.classList = "box shrine"
      }else{
        piece.classList.add("box")
      }
  }else{piece.classList.add("box")}
    piece.dataset.color = ""
    piece.dataset.id = ""
    piece.dataset.rank = ""
  })
}

function clearAllPieceButtons(color) {
  document.querySelector("#bluePieceButtonContainer").innerHTML = ""
  document.querySelector("#redPieceButtonContainer").innerHTML = ""
}




//     W I N   C O N D I T I O N   H E L P E R S     //

function evaluateWinConditions() {
  let result1 = winByClearingOpponents()
  let result2 = winBySenseiPlacement()
  let returnValue

  if (result1 === "RED WINS!" || result2 === "RED WINS!") {
    returnValue = "RED WINS!"
  } else if (result1 === "BLUE WINS!" || result2 === "BLUE WINS!") {
    returnValue = "BLUE WINS!"
  } else if (result1 === false && result2 === false) {
    returnValue = false
  }
  return returnValue
}

function winByClearingOpponents() {
  let red = 0
  let blue = 0
  let result
  getAllBoardPieces().forEach(piece => {
    piece.color === "red" ? red+=1 : blue+=1
  })
  if (red === 0) {
    result = "BLUE WINS!"
  } else if (blue === 0) {
    result = "RED WINS!"
  } else {
    result = false
  }
  return result
}

function winBySenseiPlacement() {
  let pieces = getAllBoardPieces()
  let result
  pieces.forEach(piece => {
    if (piece.rank === "sensei") {
      if (piece.color === "red" && piece.coordinates === "4-2") {
        result = "RED WINS!"
      } else if (piece.color === "blue" && piece.coordinates === "0-2") {
        result = "BLUE WINS!"
      } else {
        result = false
      }
    }
  })
  return result
}

// do I use this?
// function changePlayerIndication() {
//   let indicatorBar = document.querySelector("#indicator-bar")
//   indicatorBar.classList.toggle("red")
//   indicatorBar.classList.toggle("blue")
//   indicatorBar.innerHTML = ""
// }
