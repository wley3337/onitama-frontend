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

  static fetchPieces() {
    fetch('http://localhost:3000/pieces')
    .then(resp => resp.json())
    .then(pieces => {
      pieces.forEach(piece => {
        let newPiece = new Piece(piece.id, piece.player.id, piece.rank, piece.on_board, piece.color, piece.x, piece.y)
        newPiece.renderPieceOnBoard()
        newPiece.renderPiecesButtons()
      })
    })
  }

  renderPieceOnBoard() {
    let square = document.getElementById(`${this.x}-${this.y}`)
    square.classList.add(`${this.color}`)
    square.dataset.id = `${this.id}`
    square.dataset.color = `${this.color}`
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
  }

}
