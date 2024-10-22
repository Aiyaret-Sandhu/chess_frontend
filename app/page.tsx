import Footer from "@/components/footer"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Chess Game</h1>
        <div className="space-y-4">
          <Link href="/gamewengine" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300">
              Play with bot
            </button>
          </Link>
          <Link href="/gamewfriend" className="block">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition duration-300">
              Play with friend (local)
            </button>
          </Link>
          <Link href="/gamewonline" className="block">
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition duration-300">
              Play with friend (Online)
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}