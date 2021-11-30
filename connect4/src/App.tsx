import React from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';


enum Player{
  None = 0,
  One = 1,
  Two = 2

}

// game states for wins, draws, and ongoing
enum GameState {
  Ongoing= -1,
  Draw= 0,
  PlayerOneWin = Player.One,
  PlayerTwoWin = Player.Two
}

type Board = Player[]

 interface State{
   board: Board;
   playerTurn: Player;
   gameState: GameState | Player
 }

 // initializes the board
 const initializeBoard = () => {
   const board = []
   for (let i=0; i < 42; i++){
     board.push(Player.None)
   }
   return board;

 }

 const getPrettyPlayer = (player: Player) => {
   if (player === Player.None)
   return 'noPlayer'
   if (player == Player.One)
   return 'playerOne'
   if(player === Player.Two)
   return 'playerTwo'
 }

 // finds the lowest empty index of the grid
const findLowestEmptyIndex = (board: Board, column: number) => {

  for (let i = 35 + column; i >= 0 ; i-= 7){
    if(board[i] === Player.None) return i


  }
  return -1
}

// switches between player one and player two 
const togglePlayerTurn = (player: Player) => {
  return player === Player.One ? Player.Two : Player.One
}

const getGameState = (board: Board ) => {

  // checks for horizontal wins
  for (let r = 0 ; r < 6 ; r++){
    for (let c = 0 ; c <= 3 ; c++){
      const index = r * 7 + c;
      const boardSlice = board.slice(index, index+4)

      const winningResult = checkWinningSlice(boardSlice)
      if (winningResult !== false) return winningResult
    }
    
    }

    // checks for vertical wins
    for (let r = 0 ; r <= 3 ; r++){
      for (let c = 0 ; c < 7 ; c++){
        const index = r * 7 + c
        const boardSlice = [
          board[index],
          board[index + 7],
          board[index + 7 * 2],
          board[index + 7 * 3]
        ];
        const winningResult = checkWinningSlice(boardSlice)
        if (winningResult !== false) return winningResult
      }
      
      }



        if( board.some(cell => cell === Player.None )){
          return GameState.Ongoing
        } else {
          return GameState.Draw
        }
  };


// slices the board to check the repeating colors
const checkWinningSlice = (miniBoard: Player[]) => {
  if(miniBoard.some(cell => cell === Player.None)) return false;

  if (miniBoard[0] === miniBoard[1] &&
    miniBoard[1] === miniBoard[2] &&
    miniBoard[2] === miniBoard[3]
    ) {
      return miniBoard[1]
    } 

    return false
};

class App extends React.Component <{}, State>{


  state: State = {
    board: initializeBoard(),
    playerTurn: Player.One,
    gameState: GameState.Ongoing

  }

public renderCells = () => {
  const {board} = this.state
  
  return board.map((player, index) => this.renderCell(player, index))

}


public handleOnClick = (index: number) => () => {
  const {gameState} = this.state
  if (gameState !== GameState.Ongoing) return 
  
  const column = index % 7
  this.makeMove(column)

}

public makeMove(column:number){
  const {board, playerTurn} = this.state

  const index = findLowestEmptyIndex(board, column) // finds the lowest open index to place the color

  const newBoard = board.slice()
  newBoard[index] = playerTurn

  const gameState = getGameState(newBoard)

  this.setState({
    board: newBoard,
    playerTurn: togglePlayerTurn(playerTurn),
    gameState
  });


}

public renderCell = (player: Player, index: number) => {
  return <div className = "cell" key={index} onClick = {this.handleOnClick(index)} data-player = {getPrettyPlayer(player)}></div>


}

// displays the text based on the game state
public renderGameStatus = () =>{
  const {gameState } = this.state

  let text 
  if (gameState === GameState.Ongoing){
    text = 'Game is ongoing'
  } else if (gameState == GameState.Draw){
    text = 'Game is a draw'
  } else if (gameState === GameState.PlayerOneWin){
    text = 'Yellow wins'
  } else if (gameState === GameState.PlayerTwoWin){
    text = 'Red wins'
  }

  return <div>
    {text}
  </div>


}

public render() {
  return (
    <div className="App">
      {this.renderGameStatus() }
      <div className = "board" >
        {this.renderCells() }
      </div>
    </div>
  );
}


} 

export default App;