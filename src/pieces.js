class Piece {

  constructor(id, player_id, rank, on_board, color, x, y) {
    this.id = id
    this.player_id = player_id
    this.rank = rank
    this.on_board = on_board
    this.color = color
    this.x = x
    this.y = y
  }


  renderPieceOnBoard() {
    let square = document.getElementById(`${this.x}-${this.y}`)
    square.classList.add(`${this.color}`)
    square.dataset.id = `${this.id}`
    square.dataset.color = `${this.color}`
    square.dataset.rank = `${this.rank}`
    if (this.rank === "sensei") {
      square.classList.add(`sensei`)
    }
  }

  renderPiecesButtons() {
    let redContainer = document.getElementById("redPieceButtonContainer")
    let blueContainer = document.getElementById("bluePieceButtonContainer")
    let button = document.createElement("button")

    button.innerText = `${this.rank}-${this.id}`
    button.dataset.x = this.x
    button.dataset.y = this.y
    button.dataset.color = this.color
    button.dataset.player_id = this.player_id
    button.dataset.rank = this.rank

    this.color === "red" ? redContainer.appendChild(button) : blueContainer.appendChild(button)
    // button.addEventListener("mouseover", pieceButtonMouseoverHandler)
    button.addEventListener("click", pieceButtonClickHandler)
    button.addEventListener('mouseover', hoverPieceOn)
    button.addEventListener('mouseout', hoverPieceOff)
  }

}
