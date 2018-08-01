class Card{
    constructor(id, player_id, title, quote, moves){
        this.id = id;
        this.player_id = player_id;
        this.title = title;
        this.quote = quote;
        this.moves = moves; //this is an array of moves
    }

    cardMoveDisplay(color, cardContainerNumber){

        //clear move container of numbers
        const cardMoveHTMLArray = document.getElementById(`${color}-card-${cardContainerNumber}-move`).children;

        for(let i = 0; i < cardMoveHTMLArray.length; i++){
            cardMoveHTMLArray[i].innerText = ''
            cardMoveHTMLArray[i].classList.remove('move')
        }
        const buttonsContainer = document.getElementById(`${color}-card-${cardContainerNumber}-buttons`)

        //displays moves on the grid
        for(const move of this.moves){
            const square = document.getElementById(`${color}-${cardContainerNumber}-${move.id}`);
                square.classList.add('move')
        }
        //add card ID to button container for search
        buttonsContainer.dataset.cardId = this.id;

    }

    static chooseFive(){
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
         
            getOnDeckCardContainer().setAttribute(`data-card${cardCount +1}`,cardId);
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

    //attempt to dynamicly generate card move board
    moveBoard(){
        const onDeckDiv = document.createElement('div');
        onDeckDiv.id = "on-deck-card-move";
        onDeckDiv.classList.add("card-move");
        
        for(let i = 1; i<25;i++){
            const boardSpan = document.createElement('span');
            boardSpan.id = `on-deck-${i}`;
        }
    //   const span =  <span id='blue-2-24' data-moveId="" >24</span>;

        
    }




}
