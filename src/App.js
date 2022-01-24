import { React, useState } from 'react';

import './App.css';

// scoring
const topRowSquares = [
    [0, 0],
    [0, 1],
    [0, 2]
];
const middleRowSquares = [
    [1, 0],
    [1, 1],
    [1, 2]
];
const bottomRowSquares = [
    [2, 0],
    [2, 1],
    [2, 2]
];
const firstColumnSquares = [
    [0, 0],
    [1, 0],
    [2, 0]
];
const secondColumnSquares = [
    [0, 1],
    [1, 1],
    [2, 1]
];
const thirdColumnSquares = [
    [0, 2],
    [1, 2],
    [2, 2]
];
const diagonalDescendingSquares = [
    [0, 0],
    [1, 1],
    [2, 2]
];
const diagonalAscendingSquares = [
    [2, 0],
    [1, 1],
    [0, 2]
];

const scoringSquares = {
    0: {
        0: [
            topRowSquares,
            firstColumnSquares,
            diagonalDescendingSquares
        ],
        1: [
            topRowSquares,
            secondColumnSquares
        ],
        2: [
            topRowSquares,
            thirdColumnSquares,
            diagonalAscendingSquares
        ],
    },
    1: {
        0: [
            middleRowSquares,
            firstColumnSquares,
        ],
        1: [
            middleRowSquares,
            secondColumnSquares,
            diagonalDescendingSquares,
            diagonalAscendingSquares
        ],
        2: [
            middleRowSquares,
            thirdColumnSquares
        ],
    },
    2: {
        0: [
            bottomRowSquares,
            firstColumnSquares,
            diagonalAscendingSquares
        ],
        1: [
            bottomRowSquares,
            secondColumnSquares
        ],
        2: [
            bottomRowSquares,
            thirdColumnSquares,
            diagonalDescendingSquares
        ],
    },
};

const calculateWinner = (gameBoard, row, column) => {
    const relevantScoringSquares = scoringSquares[row][column];
    for (let i = 0; i < relevantScoringSquares.length; i++) {
        const squares = relevantScoringSquares[i];
        const squareOne = gameBoard[squares[0][0]][squares[0][1]];
        const squareTwo = gameBoard[squares[1][0]][squares[1][1]];
        const squareThree = gameBoard[squares[2][0]][squares[2][1]];
        if (squareOne && squareTwo && squareThree) {
            if (squareOne === squareTwo && squareTwo === squareThree) {
                return {letter: squareOne, squares, row, column};
            }
        }
    }
};

const GameBoard = () => {

    const defaultPlayer = 'x';
    const freshBoard = {
        0: {
            0: '',
            1: '',
            2: '',
        },
        1: {
            0: '',
            1: '',
            2: '',
        },
        2: {
            0: '',
            1: '',
            2: '',
        },
    };

    const [moves, setMoves] = useState(Object.assign({}, freshBoard));
    const [activePlayer, setActivePlayer] = useState(defaultPlayer);
    const [theWinner, setWinner] = useState();
    const [turnNumber, setTurnNumber] = useState(1);
    const [history, setHistory] = useState([]);


    const buttonClicked = ([row, column]) => {
        if (moves[row][column] !== '') return;
        let updatedMoves = Object.assign({}, moves);
        updatedMoves[row][column] = activePlayer;
        setMoves(updatedMoves);

        const gameWinner = calculateWinner(moves, row, column);
        if (gameWinner) setWinner(gameWinner.letter);

        setTurnNumber(turnNumber + 1);
        if (turnNumber === 9 && !gameWinner) setWinner('NOBODY');

        setActivePlayer(activePlayer === 'x' ? 'o' : 'x');
    }

    const ResetGameBoard = () => {
        setHistory(history => [...history, moves]);
        setMoves(Object.assign({}, freshBoard));
        setActivePlayer(defaultPlayer);
        setTurnNumber(1);
        setWinner();
    };

    const HistoryBoard = ({board}) => {
        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(Object.values(board[i]).join(' '));
        }
        return <ul>
            {result.map((n, x) => {
                return <li key={x} style={{'listStyle': 'none'}}>{n}</li>
            })}
        </ul>;
    };

    return <div className={'row'}>
        <div className={'col-sm-12 col-md-4 offset-md-4'}>
            <div id={"gameboard"}>
                <div className={'text-center'}>
                    {theWinner
                     ? <p><strong>{theWinner.toUpperCase()}</strong> wins!</p>
                     : <p>Who's turn is it? <strong>{activePlayer.toUpperCase()}!</strong></p>
                    }
                </div>
                <div className={"text-center mt-5"}>
                    {[...Array(3)].map((x, row) =>
                        <div key={row}>
                            {[...Array(3)].map((n, column) =>
                                <button
                                    id={`${row}-${column}`}
                                    onClick={() => buttonClicked([row, column])}
                                    key={row + column}
                                    className={"mx-2 mb-2"}
                                    disabled={moves[row] && moves[row][column]}
                                >
                                    {moves[row] && moves[row][column] ? moves[row][column] : '•'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className={'text-center'}>
                {theWinner && <button onClick={ResetGameBoard}>Reset</button>}
            </div>
        </div>
        <div className={'col-sm-12 col-md-4'}>
            {history.map((board, i) => {
                return <div key={i}>
                    <h3>Game {i + 1}</h3>
                    <HistoryBoard board={board}/>
                </div>
            })}
        </div>
    </div>;
};

function App() {
    return (
        <GameBoard/>
    );
}

export default App;