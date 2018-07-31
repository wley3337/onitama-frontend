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
                square.innerText = this.moves.indexOf(move) + 1;

            const moveButton = document.createElement('button');

            //invert x,y for blue orientation
           
            if(color === 'blue'){ 
                move.x = move.x * -1;
                move.y = move.y * -1;
            }
            console.log(move.x, move.y, color);
            //add dataset values for event listener access to move
            moveButton.dataset.x = move.x;
            moveButton.dataset.y = move.y;
            
            //label button
            moveButton.innerText = this.moves.indexOf(move) + 1;

            //render button to page
            buttonsContainer.appendChild(moveButton);
            //click event listener
            buttonsContainer.lastChild.addEventListener('click', selectMove)
            //hover event listenr
            buttonsContainer.lastChild.addEventListener('mouseover', hoverMove)
            addEventListener('mouseout', hoverOff)

        }

        
    }





}