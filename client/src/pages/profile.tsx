import useAuth from "@/hooks/use-auth";
import { Heart, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ProfilePage() {
    const auth = useAuth();
    const user = auth.user;

    if (!user) {
        window.location.href = "/auth";
    }

    const handleLogOut = () => {
        auth.logout();

        window.location.href = "/"
    }

    const handleRedirect = () => {
    if (auth.isAuthenticated) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/auth";
    }
  }

    return (
        <div className="min-h-screen bg-surface">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Heart className="text-white text-lg" />
                        </div>
                        <div onClick={() => window.location.href = "/"} className="cursor-pointer">
                          <h1 className="text-xl font-bold text-neutral">UCare AI</h1>
                          <p className="text-sm text-gray-500">Know what your body tells</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-500" onClick={handleRedirect}>
                        <User2Icon className="h-5 w-5" />
                      </Button>
                    </div>
                  </header>
            <div className="flex flex-col items-center mt-20">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-3xl text-gray-500">
                        {user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
                <h2 className="text-lg font-semibold mb-2">Your symptoms</h2>
                {/* Button for logging out */}
                <button
                    onClick={handleLogOut}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Log out
                </button>
                {/* Add more profile fields as needed */}
            </div>
        </div>
    );
}