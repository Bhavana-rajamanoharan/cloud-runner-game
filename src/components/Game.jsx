import { useEffect, useRef, useState } from "react"

export default function Game() {

  const [playerY, setPlayerY] = useState(120)
  const [velocity, setVelocity] = useState(0)

  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [obstacleX, setObstacleX] = useState(800)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  )

  const [speed, setSpeed] = useState(4)

  const gravity = -0.45
  const jumpForce = 11

  const jumpSound = useRef(null)
  const hitSound = useRef(null)
  const scoreSound = useRef(null)

  useEffect(() => {
    if (!started) return

    jumpSound.current = new Audio("/jump.mp3")
    hitSound.current = new Audio("/hit.mp3")
    scoreSound.current = new Audio("/score.mp3")

  }, [started])

  function playSound(sound) {
    if (!sound?.current) return
    sound.current.currentTime = 0
    sound.current.play().catch(() => {})
  }

  function jump() {
    if (!started || paused || gameOver) return
    if (playerY <= 122) {
      setVelocity(jumpForce)
      playSound(jumpSound)
    }
  }

  const screenWidth =
    typeof window !== "undefined" ? window.innerWidth : 800

  useEffect(() => {

    const interval = setInterval(() => {

      if (!started || paused || gameOver) return

      setScore((s) => {
        const newScore = s + 1

        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem("highScore", newScore)
        }

        if (newScore % 100 === 0) {
          playSound(scoreSound)
        }

        return newScore
      })

      setSpeed((s) => Math.min(s + 0.0015, 12))

      setVelocity((v) => v + gravity)

      setPlayerY((y) => {
        let nextY = y + velocity

        if (nextY <= 120) {
          nextY = 120
          setVelocity(0)
        }

        return nextY
      })

      setObstacleX((x) => {
        if (x < -60) return screenWidth + 200
        return x - speed
      })

      const playerLeft = 100
      const playerRight = 185

      const playerBottom = playerY
      const playerTop = playerY + 60

      const obstacleLeft = obstacleX
      const obstacleRight = obstacleX + 40

      const obstacleBottom = 110
      const obstacleTop = 200

      const collision =
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerTop > obstacleBottom &&
        playerBottom < obstacleTop

      if (collision) {
        setGameOver(true)
        playSound(hitSound)
      }

    }, 16)

    return () => clearInterval(interval)

  }, [
    velocity,
    started,
    paused,
    gameOver,
    speed,
    obstacleX,
    playerY,
    highScore
  ])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space") jump()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  return (

    <div
      className="
        relative
        w-screen
        h-screen
        overflow-hidden
        bg-gradient-to-b
        from-blue-950
        via-sky-600
        to-cyan-300
        touch-manipulation
      "
      onClick={jump}
    >

      {/* SKY GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00e5ff,transparent_60%)] opacity-90"></div>

      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>

      {/* GROUND */}
      <div className="absolute bottom-0 w-full h-28 bg-gradient-to-b from-lime-300 via-green-400 to-emerald-500 border-t-[6px] border-lime-100 shadow-inner"></div>

      {/* PLAYER CLOUD */}
      {started && (
        <div
          className="absolute left-16 z-20"
          style={{
            bottom: `${playerY}px`,
            width: "140px",
            height: "90px",
          }}
        >

          <div className="absolute inset-0 bg-cyan-300/40 blur-2xl rounded-full"></div>

          <div className="absolute bottom-0 left-6 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-6 left-12 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-0 left-20 w-16 h-16 bg-white rounded-full"></div>

        </div>
      )}

      {/* OBSTACLE */}
      {started && (
        <div
          className="absolute bottom-28 w-[40px] h-[110px] rounded-3xl border-2 border-pink-200 overflow-hidden"
          style={{
            left: `${obstacleX}px`,
            background: `linear-gradient(to bottom,#ff00ff,#9d4edd,#00d4ff)`,
            boxShadow: `0 0 15px #ff00ff,0 0 30px #9d4edd,0 0 60px #00d4ff`,
          }}
        />
      )}

      {/* SCORE UI */}
      {started && !gameOver && (
        <>
          <div className="absolute top-2 left-6 z-50 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
            <h2 className="text-white text-2xl font-black">
              Score: <span className="text-yellow-300">{score}</span>
            </h2>

            <h3 className="text-cyan-200 text-lg mt-2 font-bold">
              High Score: <span className="text-cyan-300">{highScore}</span>
            </h3>
          </div>

          <button
            onClick={() => setPaused(!paused)}
            className="absolute top-6 right-6 z-30 w-24 h-24 rounded-full border-[5px] border-cyan-300 bg-blue-700/70 text-white text-5xl font-black shadow-[0_0_50px_rgba(0,255,255,1)] hover:scale-110 transition-all"
          >
            {paused ? "▶" : "⏸"}
          </button>
        </>
      )}

      {/* INSTRUCTION */}
      {started && !gameOver && (
        <div className="absolute bottom-8 w-full text-center z-20 pointer-events-none">
          <p className="text-white text-lg md:text-2xl font-black tracking-wide">
            Tap or Press Space to Jump
          </p>
        </div>
      )}

      {/* HOME SCREEN */}
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-md z-50">

          <h1 className="text-7xl md:text-9xl font-black text-white">
            CLOUD RUNNER
          </h1>

          <button
            className="mt-14 px-16 py-5 text-5xl font-black text-cyan-300"
            onClick={() => setStarted(true)}
          >
            PLAY
          </button>

        </div>
      )}

      {/* GAME OVER */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-50">

          <h1 className="text-7xl font-black text-white">
            GAME OVER
          </h1>

          <p className="text-white text-3xl mt-4">
            Score: <span className="text-yellow-300">{score}</span>
          </p>

          <button
            className="mt-10 px-10 py-4 text-3xl font-black text-cyan-300"
            onClick={() => window.location.reload()}
          >
            PLAY AGAIN
          </button>

        </div>
      )}

    </div>
  )
}