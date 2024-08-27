let mainBoard = [
  ['rook-black', 'knight-black', 'bishop-black', 'king-black', 'queen-black', 'bishop-black', 'knight-black', 'rook-black'],
  ['pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white'],
  ['rook-white', 'knight-white', 'bishop-white', 'king-white', 'queen-white', 'bishop-white', 'knight-white', 'rook-white']
]
let firstSelection = '';
let currentMove = '';
let firstCoords = [];
let secondCoords = [];
let currentTurn = 'white';




// coords - это список координатов [y, x]
function getChessPiece(piece, coords) {
  if (!firstSelection) {
    if (checkWhoMoves(mainBoard, coords[0], coords[1])[0]) {
      firstSelection = document.querySelector(`.js-${piece}-button`);
      firstSelection.classList.add('js-button-clicked-styles');
    
      // координаты первой кнопки
      firstCoords = coords;
    } else {
      alert('Не ваш ход!');
    }

  } else {
    // координаты второй кнопки
    secondCoords = coords;

    console.log(mainBoard);

    if (checkForEmptyPiece(mainBoard, firstCoords[0], firstCoords[1])) {
      if (checkTheMove(mainBoard, firstCoords[0], firstCoords[1], secondCoords[0], secondCoords[1])) {
        if (checkForSelfEating(mainBoard, firstCoords[0], firstCoords[1], secondCoords[0], secondCoords[1])) {
          // Обновить очередь ходов
          currentTurn = checkWhoMoves(mainBoard, firstCoords[0], firstCoords[1])[1];

          currentMove = document.querySelector(`.js-${piece}-button`);
      
          // Чтобы элементы друг друга кушали, а не менялись местами
          currentMove.innerHTML = firstSelection.innerHTML;
          firstSelection.innerHTML = '';
    
          // Убрать стили для кнопки
          firstSelection.classList.remove('js-button-clicked-styles');
          
          // Перезаписать переменные
          firstSelection = '';
          currentMove = '';
    
          // Обновить значения доски
          mainBoard[secondCoords[0]][secondCoords[1]] = mainBoard[firstCoords[0]][firstCoords[1]];
          mainBoard[firstCoords[0]][firstCoords[1]] = null;
    
          // Перезаписать переменные
          firstCoords = [];
          secondCoords = [];
        } else {
          alert('Своих есть нельзя!');
        }
      } else {
        alert('Неправильный ход!');
      }
    } else {
      alert('Отмените свой выбор и выберите ФИГУРУ заново!');
    }

    if (checkIfSomeoneWon(mainBoard)) {
      displayVictoryAlert(mainBoard);
    }
  }
}

// Проверка хода для БЕЛОЙ ПЕШКИ
function checkWhitePawnMove(board, y1, x1, y2, x2) {
  if (board[y1][x1] === 'pawn-white') {
    if (board[y2][x2] !== null) {
      if ((x2 === x1 + 1 || x2 === x1 - 1) && (y1 === y2 + 1)) {
        return true;
      } else {
        return false;
      }
  
    } else if (board[y2][x2] === null) {
      if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
        return false;
      } else if ((x1 === x2) && (y1 === y2 + 1 || y1 === y2 + 2)) {
        return true;
      } else {
        return false;
      }
    }
  }
}

// Проверка хода для ЧЕРНОЙ ПЕШКИ
function checkBlackPawnMove(board, y1, x1, y2, x2) {
  if (board[y1][x1] === 'pawn-black') {
    if (board[y2][x2] !== null) {
      if ((x2 === x1 + 1 || x2 === x1 - 1) && y1 === y2 - 1) {
        return true;
      } else {
        return false;
      }

    } else if (board[y2][x2] === null) {
      if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
        return false;
      } else if ((x1 === x2) && (y1 === y2 - 1 || y1 === y2 - 2)) {
        return true;
      } else {
        return false;
      }
    }
  }
}

// Проверка хода для СЛОНА (ROOK)
function checkRookMove(board, y1, x1, y2, x2) {
  if (board[y1][x1].includes('rook')) {
    if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
      return false;
    } else if ((x1 === x2 && y1 !== y2) || (y1 === y2 && x1 !== x2)) {
      return true;
    } else {
      return false;
    }
  }
}

// Проверка хода для КОНЯ (KNIGHT)
function checkKnightMove(board, y1, x1, y2, x2) {
  if (board[y1][x1].includes('knight')) {
    if ((x1 === x2 + 1 || x1 === x2 - 1) && (y1 === y2 + 2 || y1 === y2 - 2)) {
      return true;
    } else if ((x1 === x2 + 2 || x1 === x2 - 2) && (y1 === y2 + 1 || y1 === y2 - 1)) {
      return true;
    } else {
      return false;
    }
  }
}

// Проверка хода для КОРОЛЯ (KING)
function checkKingMove(board, y1, x1, y2, x2) {
  if (board[y1][x1].includes('king')) {
    if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
      return false;
    } else if (x1 === x2 && y1 === y2) {
      return false;
    } else if ((x1 === x2 + 1 || x1 === x2 - 1 || x1 === x2) && (y1 === y2 + 1 || y1 === y2 - 1 || y1 === y2)) {
      return true;
    } else {
      return false;
    }
  }
}

// Проверка хода для ОФИЦЕРА (BISHOP)
function checkBishopMove(board, y1, x1, y2, x2) {
  if (board[y1][x1].includes('bishop')) {
    if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
      return false;
    } else if (x1 === x2 && y1 === y2) {
      return false;
    } else if (x2 - x1 === y2 - y1) {
      return true;
    } else if (x2 - x1 === y1 - y2) {
      return true;
    } else {
      return false;
    }
  }
}

// Проверка хода для ФЕРЗЯ (QUEEN)
function checkQueenMove(board, y1, x1, y2, x2) {
  if (board[y1][x1].includes('queen')) {
    if (!checkRoadEmptiness(board, y1, x1, y2, x2)) {
      return false;
    } else if (x1 === x2 && y1 === y2) {
      return false;
    } else if ((x1 == x2 && y1 != y2) || (y1 == y2 && x1 != x2)) {
      return true;
    } else if (x2 - x1 === y2 - y1) {
      return true;
    } else if (x2 - x1 === y1 - y2) {
      return true;
    } else {
      return false;
    }
  }
}

// Проверка АБСОЛЮТНО ВСЕХ ФИГУР
function checkTheMove(board, y1, x1, y2, x2) {
  if (checkWhitePawnMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkBlackPawnMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkRookMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkKnightMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkKingMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkBishopMove(board, y1, x1, y2, x2)) {
    return true;
  } else if (checkQueenMove(board, y1, x1, y2, x2)) {
    return true;
  } else {
    return false;
  }
}

// Проверка на то если фигуры едят своих же фигур
function checkForSelfEating(board, y1, x1, y2, x2) {
  if (board[y1][x1] !== null && board[y2][x2] === null) {
    return true
  } else if (board[y1][x1].includes('white') && board[y2][x2].includes('white')) {
    return false
  } else if (board[y1][x1].includes('black') && board[y2][x2].includes('black')) {
    return false
  } else {
    return true
  }
}

// Проверка на то если игрок выбрал пустое поле
function checkForEmptyPiece(board, y1, x1) {
  if (board[y1][x1] === null) {
    return false;
  } else {
    return true;
  }
}

// Обработка кнопки "Отменить выбранную фигуру"
function cancelSelectedPiece() {
  if (firstSelection) {
    firstSelection.classList.remove('js-button-clicked-styles');
    firstSelection = '';
  }
}

// Чтобы фигуры не перескакивали друг друга
function checkRoadEmptiness(board, y1, x1, y2, x2) {
  const xStep = x1 === x2 ? 0 : (x2 > x1 ? 1 : -1);
  const yStep = y1 === y2 ? 0 : (y2 > y1 ? 1 : -1);

  let x = x1 + xStep;
  let y = y1 + yStep;

  while (x != x2 || y != y2) {
    if (board[y][x] !== null) {
      return false;
    }
    x += xStep;
    y += yStep
  }
  return true;
}

// Проверка очереди ходов
function checkWhoMoves(board, y1, x1) {
  if (currentTurn === 'white' && board[y1][x1].includes('white')) {
    return [true, 'black'];
  } else if (currentTurn === 'black' && board[y1][x1].includes('black')) {
    return [true, 'white'];
  } else {
    return [false];
  }
}

// Проверка на то если кто то выиграл
function checkIfSomeoneWon(board) {
  let kingCounter = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] !== null) {
        if (board[i][j].includes('king')) {
          kingCounter++;
        }
      }
    }
  }
  if (kingCounter === 2) {
    return false;
  } else if (kingCounter === 1) {
    return true
  }
}

// Вывести то кто выиграл
function displayVictoryAlert(board) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 'king-black') {
        alert('Черные выиграли, поздравляем!');
        document.body.innerHTML = 'Спасибо за игру';
        return;
      } else if (board[i][j] === 'king-white') {
        alert('Белые выиграли, поздравляем!');
        document.body.innerHTML = 'Спасибо за игру';
        return;
      }
    }
  }
}