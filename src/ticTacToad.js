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

var turn = true
var turnNumber = -1

function userTurn(row, col) {

    if(!turn){
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

    // Switch turn
    turn = !turn;
    turnNumber++;
    computerTurn();
}

function computerTurn(){

  console.log("====== STARTING COMPUTER TURN ======\n--012345678")

  // 1. Create token's potential moves
  var moves = []
  var moveScores = []
  for(var ii = 0; ii < 3; ii++){
      for(var jj = 0; jj < 3; jj++){

        var boardCopy = getBoardCopy(board)
        if(boardCopy[ii][jj] == null){
          boardCopy[ii][jj] = 'O'
          moves.push(getBoardCopy(boardCopy))


          let moveScore = minMax(boardCopy, turnNumber, true)
          moveScores.push(moveScore);
        } else {
          continue
        }

      }
  }

  // Now we have our choices. Let's evaluate our choices.


  for(var ii = 0; ii < moveScores.length; ii++){
    console.log("--" + stringForBoard(moves[ii]) + ": Score: " + moveScores[ii])
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
  //if(moves[index] != null){
  board = moves[index]
  //}
  console.log("Choosing move " + stringForBoard(board) + " with score: " + maxScore)
  updateBoardGUI()

  turn = !turn;
}

function minMax(move, depth, isMaximizing){
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
            let moveScore = minMax(boardCopy, depth + 1, !isMaximizing);
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
            let moveScore = minMax(boardCopy, depth + 1, !isMaximizing);
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
  if(theBoard == null){
    console.log("Prevented issue in isWinner")
    return null
  }
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
