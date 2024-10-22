'use client'

import { useState, useEffect } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "@/components/header"

export default function LocalChessGame() {
  const [chess] = useState(new Chess())
  const [fen, setFen] = useState<string>(chess.fen())
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [showValidMoves, setShowValidMoves] = useState<boolean>(false)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [showRestartPrompt, setShowRestartPrompt] = useState<boolean>(false)

  const STORAGE_KEY = "onlineChessGame"

  useEffect(() => {
    loadGame()
  }, [])

  type Square = 
  | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8'
  | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8'
  | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8'
  | 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8'
  | 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8'
  | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8'
  | 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';


  type Piece = {
    type: "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"; // Add more as needed
    color: "white" | "black";
  };
  

  const saveGame = () => {
    const gameState = {
      fen: chess.fen(),
      currentPlayer,
      moveHistory,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
  }

  const loadGame = () => {
    const savedGame = localStorage.getItem(STORAGE_KEY)
    if (savedGame) {
      const { fen, currentPlayer, moveHistory } = JSON.parse(savedGame)
      chess.load(fen)
      setFen(fen)
      setCurrentPlayer(currentPlayer)
      setMoveHistory(moveHistory)
    }
  }

  const startNewGame = () => {
    chess.reset()
    setFen(chess.fen())
    setCurrentPlayer("white")
    setMoveHistory([])
    setValidMoves([])
    setSelectedSquare(null)
    saveGame()
    toast.success("New game started!")
  }

  const handleShowValidMoves = () => {
    setShowValidMoves((prev) => !prev)
  }

  const makeMove = (move: { from: Square; to: Square; promotion?: string }) => {
    const result = chess.move(move)
    if (result) {
      setFen(chess.fen())
      setValidMoves([])
      setSelectedSquare(null)

      const newMoveHistory = [
        ...moveHistory,
        `${currentPlayer === "white" ? "White" : "Black"}: ${result.san}`,
      ]
      setMoveHistory(newMoveHistory)
      const newCurrentPlayer = currentPlayer === "white" ? "black" : "white"
      setCurrentPlayer(newCurrentPlayer)

      if (chess.isCheckmate()) {
        toast.success(
          `Checkmate! ${currentPlayer === "white" ? "White" : "Black"} wins!`
        )
        setShowRestartPrompt(true)
      } else if (chess.isDraw()) {
        toast.info("Game is a draw!")
        setShowRestartPrompt(true)
      }

      // Save game state after all updates
      const gameState = {
        fen: chess.fen(),
        currentPlayer: newCurrentPlayer,
        moveHistory: newMoveHistory,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))

      return true;
    } else {
      toast.error("Invalid move!")

      return false;
    }
  }

  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      const move = { from: selectedSquare, to: square };
      makeMove(move);
      setSelectedSquare(null); // Reset selected square after making the move
    } else {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true }) as Array<{ to: string }>;
      const validMoveSquares = moves.map((move) => move.to);
      setValidMoves(validMoveSquares);
    }
  };


  const onPieceDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece): boolean => {
    const move = { from: sourceSquare, to: targetSquare };
    
    // Check if the move is valid
    const result = makeMove(move); // Assume makeMove returns a boolean indicating success
  
    return result; // Return true or false based on whether the move was successful
  };
  


  const renderMoveHistory = () => (
    <div className="move-history bg-gray-900 text-white p-4 rounded-md overflow-y-auto h-64 w-96">
      <h3 className="text-lg mb-2">Move History</h3>
      <hr className="mb-2" />
      <p className="text-gray-400">
        {moveHistory.map((move, index) => (
          <span key={index} className="mr-2">
            {move}, 
          </span>
        ))}
      </p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-20">
        <div className="flex flex-col gap-4 align-middle justify-center w-96">
          <div className="flex gap-4 align-middle justify-center">
            <button
              onClick={startNewGame}
              className="px-6 py-2"
              style={{
                backgroundColor: "rgba(40,40,40,0.8)",
                borderRadius: "0.15rem",
                color: "rgba(0, 220, 0, 0.8)",
              }}
            >
              New Game
            </button>
            <button
              onClick={handleShowValidMoves}
              className="px-6 py-2"
              style={{
                backgroundColor: "rgba(40,40,40,0.8)",
                borderRadius: "0.15rem",
                color: "rgba(220, 0, 0, 0.8)",
              }}
            >
              {showValidMoves ? "Hide Moves" : "Show Moves"}
            </button>
          </div>
          <p className="text-lg flex align-middle justify-center">
            Current Player: {currentPlayer === "white" ? "White" : "Black"}
          </p>
          {renderMoveHistory()}
        </div>

        <div style={{ width: '34rem', height: '34rem'}}>
          <Chessboard
            position={fen}
            onSquareClick={handleSquareClick}
            onPieceDrop={onPieceDrop}
            boardOrientation={currentPlayer === "white" ? "white" : "black"}
            customSquareStyles={
              showValidMoves
                ? Object.fromEntries(
                    validMoves.map((square) => [
                      square,
                      {
                        background: "rgba(100, 100, 100, 0.4)",
                        borderRadius: "50%",
                      },
                    ])
                  )
                : {}
            }
          />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
      />

      {showRestartPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg mb-4 text-black">
              The game is over. Would you like to start a new game?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowRestartPrompt(false)
                  startNewGame()
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRestartPrompt(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}