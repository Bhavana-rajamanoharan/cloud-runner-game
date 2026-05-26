export default function Player({ y }) {
  return (
    <div
      className="absolute left-16 transition-all duration-75"
      style={{
        bottom: `${y}px`,
      }}
    >

      <div className="relative w-28 h-20">

        {/* Cloud Body */}
        <div className="absolute w-16 h-16 bg-white rounded-full left-0 top-4 shadow-2xl"></div>

        <div className="absolute w-20 h-20 bg-white rounded-full left-8 top-0 shadow-2xl"></div>

        <div className="absolute w-16 h-16 bg-white rounded-full left-18 top-4 shadow-2xl"></div>

        {/* Eyes */}
        <div className="absolute top-8 left-12 w-2 h-5 bg-sky-700 rounded-full"></div>

        <div className="absolute top-8 left-20 w-2 h-5 bg-sky-700 rounded-full"></div>

        {/* Smile */}
        <div className="absolute top-14 left-14 w-6 h-3 border-b-2 border-sky-700 rounded-full"></div>

      </div>

    </div>
  )
}