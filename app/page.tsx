import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-gray-900">
          Notion Clone
        </h1>
        <p className="text-xl text-gray-600">
          A powerful workspace for your notes and documents
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium border"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}