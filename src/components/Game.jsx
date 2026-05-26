import { useEffect, useState } from "react"

export default function Game() {

  const [playerY, setPlayerY] = useState(120)
  const [velocity, setVelocity] = useState(0)

  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)

  const [obstacleX, setObstacleX] = useState(window.innerWidth)

  const [gameOver, setGameOver] = useState(false)

  const [score, setScore] = useState(0)

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  )

  const [speed, setSpeed] = useState(4)

  const gravity = -0.45
  const jumpForce = 11

  function jump() {
    if (playerY <= 122 && !gameOver && started && !paused) {
      setVelocity(jumpForce)
    }
  }

  useEffect(() => {

    const interval = setInterval(() => {

      if (gameOver || !started || paused) return

      setScore((s) => {
        const newScore = s + 1

        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem("highScore", newScore)
        }

        return newScore
      })

      setSpeed((s) => Math.min(s + 0.0018, 12))

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
        if (x < -120) {
          return window.innerWidth + 300
        }
        return x - speed
      })

      const playerLeft = 100
      const playerRight = 185

      const playerBottom = playerY + 10
      const playerTop = playerY + 70

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
      if (e.code === "Space") {
        jump()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }

  })

  return (

    <div
      className="
        relative
        w-screen
        h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        bg-gradient-to-b
        from-blue-950
        via-sky-600
        to-cyan-300
        touch-manipulation
      "
      onClick={jump}
    >

      {/* GAME STAGE (ONLY RESPONSIVE CHANGE HERE) */}
      <div
        className="
          relative
          w-[96vw]
          sm:w-[92vw]
          md:w-[85vw]
          lg:w-[70vw]
          max-w-[1000px]
          min-h-[520px]
          aspect-[16/9]
          overflow-hidden
          rounded-2xl
        "
      >

        {/* SKY GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00e5ff,transparent_60%)] opacity-90"></div>

        {/* BACKGROUND LIGHTS */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>

        {/* GROUND */}
        <div className="absolute bottom-0 w-full h-28 bg-gradient-to-b from-lime-300 via-green-400 to-emerald-500 border-t-[6px] border-lime-100"></div>

        {/* PLAYER CLOUD */}
        {started && (
          <div
            className="absolute left-16 z-20"
            style={{ bottom: `${playerY}px` }}
          >

            {/* glow */}
            <div className="absolute w-[140px] h-[90px] bg-cyan-300/40 blur-2xl rounded-full"></div>

            {/* cloud */}
            <div className="absolute bottom-0 left-6 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-0 left-20 w-16 h-16 bg-white rounded-full"></div>

          </div>
        )}

        {/* OBSTACLE */}
        {started && (
          <div
            className="
              absolute
              bottom-28
              w-[40px]
              h-[110px]
              rounded-3xl
              border-2
              border-pink-200
              overflow-hidden
            "
            style={{
              left: `${obstacleX}px`,
              background: `linear-gradient(to bottom,#ff00ff,#9d4edd,#00d4ff)`,
              boxShadow: `0 0 15px #ff00ff, 0 0 30px #9d4edd, 0 0 60px #00d4ff`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 blur-sm"></div>
          </div>
        )}

        {/* UI */}
        {started && !gameOver && (
          <>
            <div className="absolute top-3 left-3 z-30 bg-black/30 px-3 py-2 rounded-lg text-white">
              Score: {score}
              <br />
              High: {highScore}
            </div>

            <button
              onClick={() => setPaused(!paused)}
              className="absolute top-3 right-3 z-30 text-white text-3xl"
            >
              {paused ? "▶" : "⏸"}
            </button>

            <div className="absolute bottom-5 w-full text-center text-white font-bold">
              Tap or Press Space to Jump
            </div>
          </>
        )}

        {/* HOME */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 backdrop-blur-md">

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white">
              CLOUD RUNNER
            </h1>

            <button
              className="mt-8 px-10 py-4 text-2xl text-cyan-300 font-black"
              onClick={() => setStarted(true)}
            >
              PLAY
            </button>

          </div>
        )}

        {/* GAME OVER */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">

            <h1 className="text-5xl font-black">GAME OVER</h1>

            <button
              className="mt-6 px-8 py-3 text-cyan-300"
              onClick={() => window.location.reload()}
            >
              RESTART
            </button>

          </div>
        )}

      </div>
    </div>
  )
}