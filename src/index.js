//----fetch requests

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

//---get dom elements


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

//---functions
function choseFive(){
    let gameCards = [];
    for(let i = gameCards.length; i < 5; i = gameCards.length){
        gameCards.push(Math.floor(Math.random() * 17))
        let unique = [...new Set(gameCards)]; 
        if(unique.indexOf(0) != -1){
            unique.splice(unique.indexOf(0), 1);
        }
        gameCards = unique;
    }
    let cardCount = 0
    for(let cardId of gameCards){
        if(cardCount < 2){
            createCard(cardId, "red", cardCount + 1);
            cardCount++;
        }else if(cardCount<4){
            createCard(cardId, "blue", cardCount -1);
            cardCount++;
        }else{
            console.log("5th card:", cardId, gameCards)
           
            // createCard(cardId, "black", 1);
        }
    }


}

function createCard(cardId, color, cardContainerNumber){
    getCard(cardId).then(card => {
          const newCard = new Card(card.id, card.player_id, card.title, card.quote, card.moves)
      
          getPlayerCardTitle(color,cardContainerNumber).innerText = newCard.title;
          getPlayerCardQuote(color,cardContainerNumber).innerText = newCard.quote;
          newCard.cardMoveDisplay(color, cardContainerNumber)
      })
  }



  function selectMove(e){
      console.log(e);
      debugger;
  }

  function hoverMove(e){
    event.stopPropagation();
    const pieceLocation = {x: 3, y: 2}
    const moveX = parseInt(e.target.dataset.x);
    const moveY = parseInt(e.target.dataset.y);
    const potentialMove = getBoardSquare(pieceLocation.x + moveX, pieceLocation.y + moveY)
    potentialMove.classList.add('move')
    
  }

  function hoverOff(e){
    const pieceLocation = {x: 3, y: 2}
    const moveX = parseInt(e.target.dataset.x);
    const moveY = parseInt(e.target.dataset.y);
    const potentialMove = getBoardSquare(pieceLocation.x + moveX, pieceLocation.y + moveY)
    potentialMove.classList.remove('move')

  }