export default function Unauthorize() {
  return (
    <>
      <div
        className="flex items-center justify-center text-center"
      >
        <div className="flex-none">
          <h1 className="text-2xl font-black tracking-wide text-transparent sm:text-5xl bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text">
            Unauthorize
          </h1>
          <p className="font-bold text-gray-500 sm:text-lg">
            This access is illegal as this page requires login.
          </p>
        </div>
      </div>
    </>
  )
}
