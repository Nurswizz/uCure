import useAuth from "@/hooks/use-auth";
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

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-3xl text-gray-500">
                        {user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
                <h2 className="text-lg font-semibold mb-2">Your symptoms</h2>
                {/* Button for logging out */}
                <button
                    onClick={auth.logout}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Log out
                </button>
                {/* Add more profile fields as needed */}
            </div>
        </div>
    );
}