import { useState } from 'react';

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

    const defaultPlayer = 'X';
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

        setActivePlayer(activePlayer === 'X' ? 'O' : 'X');
    }

    const ResetGameBoard = () => {
        setHistory(history => [...history, {winner: theWinner, board: moves}]);

        setMoves(Object.assign({}, freshBoard));
        setActivePlayer(defaultPlayer);
        setTurnNumber(1);
        setWinner();
    };

    const GameBoardButtons = () => {
        return <>
            {[...Array(3)].map((x, row) =>
                <div className={"mb-2"} key={row}>
                    {[...Array(3)].map((n, column) =>
                        <button
                            id={`${row}-${column}`}
                            onClick={() => buttonClicked([row, column])}
                            key={row + column}
                            className={"mx-2"}
                            disabled={moves[row] && moves[row][column]}
                        >
                            {moves[row] && moves[row][column] ? moves[row][column] : '◇'}
                        </button>
                    )}
                </div>
            )}
        </>;
    }

    const HistoryBoard = ({board}) => {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            let cells = [];
            for (let j = 0; j < 3; j++) {
                cells.push(board[i][j] || '•');
            }
            rows.push(cells);
        }

        return <table>
            {rows.map((row) => {
                return <tr>
                    {row.map((cell, j) => {
                        return <td
                            key={j}
                            style={{border: '1px solid', lineHeight: '13px', textAlign: 'center', padding: '2px'}}
                        >
                            {cell}
                        </td>
                    })}
                </tr>
            })}
        </table>;
    };

    return <div className={'row mt-5'}>
        <div className={'col-sm-12 col-md-4'}>
            {history.length > 0 &&
            <div className="card mx-5">
                <div className="card-header">
                    Stats
                </div>
                <div className="card-body">
                    <h5 className="card-title">Win Percentage</h5>
                    <p>X: {history.length &&
                    parseInt(history.filter(n => n.winner === 'X').length / history.length * 100, 10) + '%'}</p>
                    <p>O: {history.length &&
                    parseInt(history.filter(n => n.winner === 'O').length / history.length * 100, 10) + '%'}</p>
                </div>
            </div>}
        </div>
        <div className={'col-sm-12 col-md-4'}>
            <div id={"gameboard"}>
                <div className={'text-center'}>
                    {theWinner
                     ? <p><strong>{theWinner}</strong> wins!</p>
                     : <p>Who's turn is it? <strong>{activePlayer}!</strong></p>
                    }
                </div>
                <div className={"text-center mt-3"}>
                    <GameBoardButtons/>
                </div>
            </div>

            {theWinner &&
            <div className={'text-center'}>
                <button className="btn btn-primary" onClick={ResetGameBoard}>Reset</button>
            </div>}
        </div>
        <div className={'col-sm-12 col-md-4'}>
            {history.length > 0 &&
            <div className="card mx-5">
                <div className="card-header">
                    History
                </div>
                <div className="card-body">
                    {history.map((result, i) => {
                        return <div key={i} className={"mt-3"}>
                            <h5 className="card-title">Game {i + 1} - Winner {result.winner}</h5>
                            <HistoryBoard board={result.board}/>
                        </div>
                    })}
                </div>
            </div>}
        </div>
    </div>;
};

function App() {
    return (
        <GameBoard/>
    );
}

export default App;