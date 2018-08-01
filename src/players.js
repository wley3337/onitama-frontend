class Player {

//     F E T C H   P L A Y E R   I N F O     //
  static getPlayers() {
    fetch(`http://localhost:3000/players`)
    .then(resp => resp.json())
    .then(players => {
      players.forEach(player => {
        if (player.active_player === true) {
          initializePlayerIndication(player.pieces[0].color)
        }
        player.pieces.forEach(piece => {
          let newPiece = new Piece(piece.id, player.id, piece.rank, piece.on_board, piece.color, piece.x, piece.y)
          newPiece.renderPieceOnBoard()
          newPiece.renderPiecesButtons()
        })
      })
    })
  }



}
