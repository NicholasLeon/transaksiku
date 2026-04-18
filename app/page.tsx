import LoginPage from "./components/login";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#cbf3f0] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-[#2ec4b6]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transaksiku</h1>
        </div>
        <LoginPage />
      </div>
    </main>
  );
}