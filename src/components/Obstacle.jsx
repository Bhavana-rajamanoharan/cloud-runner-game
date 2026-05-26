export default function Obstacle({ x }) {

  return (

    <div
      className="absolute bottom-28"
      style={{
        left: `${x}px`,
      }}
    >

      <div className="relative flex items-center justify-center">

        {/* Main Lightning */}
        <div
          className="
            w-8
            h-24
            bg-gradient-to-b
            from-yellow-200
            via-yellow-400
            to-orange-500
            rounded-full
            shadow-[0_0_25px_rgba(255,255,0,0.7)]
          "
        ></div>

        {/* Inner Glow */}
        <div
          className="
            absolute
            w-4
            h-16
            bg-white/70
            rounded-full
            blur-sm
          "
        ></div>

      </div>

    </div>
  )
}