class Player {

//     F E T C H   P L A Y E R   I N F O     //
  static getPlayers() {
    fetch(`https://enigmatic-dusk-38753.herokuapp.com/players`)
    // fetch(`http://localhost:3000/players`)
    .then(resp => resp.json())
    .then(players => {
      players.forEach(player => {
        if (player.active_player === true) {
          initializePlayerIndication(player.pieces[0].color)
          //display 5th card "will go to" in button container
         getOnDeckCardButtonContainer().innerText = `This card will go to: ${player.name} player`
        }
        player.pieces.forEach(piece => {
          let newPiece = new Piece(piece.id, player.id, piece.rank, piece.on_board, piece.color, piece.x, piece.y)
          if (newPiece.on_board) {
            newPiece.renderPieceOnBoard()
            if (player.active_player) {newPiece.renderPiecesButtons()}
          }
        })
      })
    })
  }



}
