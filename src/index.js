document.addEventListener("DOMContentLoaded", function() {
  console.log("connected")
  Piece.fetchPieces()
})

// function showActivePlayer() {
//   fetch(`http://localhost:3000/players`)
//   .then(resp => resp.json())
//   .then(players => {
//     player.
//   })
// }


// This is where the start of the play happens?
function pieceButtonClickHandler(e) {
  let square = getSquare(e.target.dataset.x, e.target.dataset.y)
  let siblingButtons = Array.from(e.target.parentElement.children)

  undoLeftoverHighlight(siblingButtons)

  square.classList.toggle(`${e.target.dataset.color}`)
  square.classList.toggle(`highlight`)
  e.target.dataset.clicked = true

  // add the event listeners for the cards here.
  // we will need to toggle it back in case another piece is selected
}


//     H E L P E R S     //
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
