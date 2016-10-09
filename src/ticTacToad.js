// Board:
//  X: x
//  O: o
// Turn Variable:
//  true: x
//  false: O

var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

var boardDictionary = {}  // Used for memoization

var gameIsOver = false
var turn = true
var turnNumber = -1

function userTurn(row, col) {

  if(gameIsOver || !turn){
    return
  }

  turnNumber++;

  if(board[row][col] != null){
  // If someone has already played in this spot, return
    return;
  } else {
    // Set board
    board[row][col] = 'X'
    updateBoardGUI();
  }

  // Check for winner
  var winner = isGameOver(board)
  if(winner != 'N'){
    console.log(winner + " wins!")
    updateGUIWithEndState(winner)
    return
  }

  // Switch turn
  turn = !turn;
  turnNumber++;
  computerTurn();

  winner = isGameOver(board)
  if(winner != 'N'){
    console.log(winner + " wins!")
    updateGUIWithEndState(winner)
  }
}

function computerTurn(){
  // Check to see if we can win on this turn
  for(var ii = 0; ii < 3; ii++){
      for(var jj = 0; jj < 3; jj++){

        var boardCopy = getBoardCopy(board)
        if(boardCopy[ii][jj] == null){
          boardCopy[ii][jj] = 'O'

          if(isWinner(boardCopy) != null){
            // X is going to win if they were to play here. Let's take it.
            console.log("Choosing " + stringForBoard(boardCopy) + " for the win!")
            boardCopy[ii][jj] = 'O'
            board = boardCopy
            updateBoardGUI()
            turn = !turn;
            return;
          }
        } else {
          continue
        }
      }
  }

  // Check to make sure player can't win on next turn
  for(var ii = 0; ii < 3; ii++){
      for(var jj = 0; jj < 3; jj++){

        var boardCopy = getBoardCopy(board)
        if(boardCopy[ii][jj] == null){
          boardCopy[ii][jj] = 'X'

          if(isWinner(boardCopy) != null){
            // X is going to win if they were to play here. Let's take it.
            console.log("Choosing " + stringForBoard(boardCopy) + " so X won't win.")
            boardCopy[ii][jj] = 'O'
            board = boardCopy
            updateBoardGUI()
            turn = !turn;
            return;
          }

        } else {
          continue
        }

      }
  }

  // 1. Create token's potential moves
  var moves = []
  var moveScores = []
  for(var ii = 0; ii < 3; ii++){
      for(var jj = 0; jj < 3; jj++){

        var boardCopy = getBoardCopy(board)
        if(boardCopy[ii][jj] == null){
          boardCopy[ii][jj] = 'O'
          moves.push(getBoardCopy(boardCopy))


          let moveScore = evaluateMove(boardCopy, turnNumber, true)
          moveScores.push(moveScore);
        } else {
          continue
        }

      }
  }

  // Now we have our potential choices. Let's evaluate our choices.
  console.log("===Possible Moves===")
  for(var ii = 0; ii < moves.length; ii++){
    console.log("Evaluating " + stringForBoard(moves[ii]) + ": " + moveScores[ii])
  }

  var maxScore = -1000
  var index = -1
  for(var ii = 0; ii < moveScores.length; ii++){
    let moveScore = moveScores[ii];
    if(moveScore > maxScore){
      maxScore = moveScore
      index = ii
    }
  }

  // Choose moves[maxScore] to play.
  console.log("Choosing " + stringForBoard(moves[index]) + " for " + maxScore)
  board = moves[index]
  updateBoardGUI()
  turn = !turn;
}

function evaluateMove(move, depth, isMaximizing){
  // Exit recursion
  if(isWinner(move) != null){
      if(isWinner(move) == 'X'){
        // X is winner (user)
        return (-10 - depth)
      }
      if(isWinner(move) == 'O'){
        // O is winner (computer)
        return (10)
      }
  }

  if(isMaximizing){
    // O
    // Generate scores
    var moves = []
    var moveScores = []
    for(var ii = 0; ii < 3; ii++){
        for(var jj = 0; jj < 3; jj++){

          var boardCopy = getBoardCopy(move)

          if(boardCopy[ii][jj] == null){
            boardCopy[ii][jj] = 'X'
            moves.push(getBoardCopy(boardCopy))
            let moveScore = evaluateMove(boardCopy, depth + 1, !isMaximizing);
            moveScores.push(moveScore);
          } else {
            continue;
          }

        }
    }

    // Return best score
    var max = -1000000
    for(var ii = 0; ii < moveScores.length; ii++){
      let temp = moveScores[ii]
      if(temp > max){
        max = temp
      }
    }

    return max

  } else {
    // X

    var moves = []
    var moveScores = []
    for(var ii = 0; ii < 3; ii++){
        for(var jj = 0; jj < 3; jj++){

          var boardCopy = getBoardCopy(move)

          if(boardCopy[ii][jj] == null){
            boardCopy[ii][jj] = 'O'
            moves.push(getBoardCopy(boardCopy))
            let moveScore = evaluateMove(boardCopy, depth + 1, !isMaximizing);
            moveScores.push(moveScore);
          } else {
            continue;
          }

        }
    }

    // Return best score
    var min = 11000000
    for(var ii = 0; ii < moveScores.length; ii++){
      let temp = moveScores[ii]
      if(temp < min){
        min = temp
      }
    }

    return min
  }
}

function isWinner(theBoard){
  // Returns char of winner
  // *|*|*
  //  | |
  //  | |
  if((theBoard[0][0] == theBoard[0][1]) && (theBoard[0][1] == theBoard[0][2])){
    return theBoard[0][0]
  }

  //  | |
  // *|*|*
  //  | |
  if((theBoard[1][0] == theBoard[1][1]) && (theBoard[1][1] == theBoard[1][2])){
    return theBoard[1][0]
  }

  //  | |
  //  | |
  // *|*|*
  if((theBoard[2][0] == theBoard[2][1]) && (theBoard[2][1] == theBoard[2][2])){
    return theBoard[2][2]
  }

  // *| |
  // *| |
  // *| |
  if((theBoard[0][0] == theBoard[1][0]) && (theBoard[1][0] == theBoard[2][0])){
    return theBoard[0][0]
  }

  //  |*|
  //  |*|
  //  |*|
  if((theBoard[0][1] == theBoard[1][1]) && (theBoard[1][1] == theBoard[2][1])){
    return theBoard[0][1]
  }

  //  | |*
  //  | |*
  //  | |*
  if((theBoard[0][2] == theBoard[1][2]) && (theBoard[1][2] == theBoard[2][2])){
    return theBoard[0][2]
  }

  // *| |
  //  |*|
  //  | |*
  if((theBoard[0][0] == theBoard[1][1]) && (theBoard[1][1] == theBoard[2][2])){
    return theBoard[0][0]
  }

  //  | |*
  //  |*|
  // *| |
  if((theBoard[0][2] == theBoard[1][1]) && (theBoard[1][1] == theBoard[2][0])){
    return theBoard[0][2]
  }

  return null
}

function isGameOver(theBoard){
  // Determines if a board represents an end state.
  // Return values:
  // X: X is the winner
  // Y: Y is the winner
  // D: Draw
  // N: Game is not over
  let winner = isWinner(theBoard)
  if(winner != null){
    return winner
  }

  // Check for draw
  var draw = true
  for(var ii = 0; ii < 3; ii++){
    for(var jj = 0; jj < 3; jj++){
      if(theBoard[ii][jj] == null){
        // There is an unused spot
        draw = false
      }
    }
  }

  if(draw){
    return 'D'  // D for draw
  }

  // At this point, the game must not be over
  return 'N'
}

function stringForBoard(theBoard){
  if(theBoard == undefined){
    return ""
  }
  var string = ""
  for(var ii = 0; ii < 3; ii++){
    for(var jj = 0; jj < 3; jj++){
      if(theBoard[ii][jj] == null){
        string += ' '
      } else {
        string += theBoard[ii][jj];
      }
    }
  }
  return string
}

function getBoardCopy(toCopy){
  // Function to perform deep copy of board array
  var copy = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  for(var ii = 0; ii < 3; ii++){
    for(var jj = 0; jj < 3; jj++){
      copy[ii][jj] = toCopy[ii][jj]
    }
  }

  return copy
}

function updateBoardGUI(){
  // Calculate index...
  for(var ii = 0; ii < 3; ii++){
    for(var jj = 0; jj < 3; jj++){
      // Set token on board GUI
      let index = (ii * 3) + jj
      switch (index) {
        case 0:
          document.getElementById("00").innerHTML = board[0][0];
          break;
        case 1:
          document.getElementById("01").innerHTML = board[0][1];
          break;
        case 2:
          document.getElementById("02").innerHTML = board[0][2];
          break;
        case 3:
          document.getElementById("10").innerHTML = board[1][0];
          break;
        case 4:
          document.getElementById("11").innerHTML = board[1][1];
          break;
        case 5:
          document.getElementById("12").innerHTML = board[1][2];
          break;
        case 6:
          document.getElementById("20").innerHTML = board[2][0];
          break;
        case 7:
          document.getElementById("21").innerHTML = board[2][1];
          break;
        case 8:
          document.getElementById("22").innerHTML = board[2][2];
          break;
        default:
          break;
      }
    }
  }
}

function updateGUIWithEndState(endState){
  switch (endState) {
    case 'O':
      // Computer wins
      document.getElementById("message").innerHTML = "Looks like I win! Want to try again?"
      break;
    case 'X':
      // User wins
      document.getElementById("message").innerHTML = "Wow, good job! Everyone gets lucky every now and then...want to try your luck and play again?"
      break;
    case 'D':
      document.getElementById("message").innerHTML = "Drats, its a draw. Rematch?"
      break;
    default:
      break;
  }

  // Show retry button
  document.getElementById("retry-button").style.display = "inline-block"

}

function resetGame(){
  // Hide retry button
  document.getElementById("retry-button").style.display = "none"
  document.getElementById("message").innerHTML = "Think you can beat me? :)"

  // Reset board
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  updateBoardGUI()

  // Reset global game state variables
  turnNumber = -1
  gameIsOver = false
  turn = true
}
