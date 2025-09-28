import React from 'react'

const DashboardView = ({ token, onLogout }) => {
    const [protectedData, setProtectedData] = useState('Loading protected data...');

    // Function to fetch data from a protected endpoint using the JWT
    const fetchProtectedData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/protected-route`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // This is the critical step for JWT authentication!
                    'Authorization': `Bearer ${token}` 
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProtectedData(data.message || 'Successfully fetched protected data!');
            } else {
                // If the token is expired or invalid, the server will send an error (e.g., 401 Unauthorized)
                setProtectedData(`Unauthorized: ${data.message || 'Token is invalid or expired. Logging out.'}`);
                onLogout(); // Force logout if token is rejected
            }

        } catch (error) {
            console.error("Error fetching protected data:", error);
            setProtectedData('Error: Could not connect to API or network failed.');
        }
    }, [token, onLogout]);

    useEffect(() => {
        fetchProtectedData();
    }, [fetchProtectedData]);

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <header className="flex justify-between items-center py-4 border-b border-indigo-200 mb-8">
                <h1 className="text-3xl font-bold text-indigo-700">Protected Application</h1>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-red-600 transition duration-150"
                >
                    Logout
                </button>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Granted!</h2>
                
                <p className="text-lg text-green-600 font-medium mb-6">
                    You are viewing the private content because you hold a valid JWT.
                </p>
                
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-700 mb-2">Protected API Response Status:</p>
                        <p className="font-mono text-sm break-all text-gray-700">{protectedData}</p>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg">
                        <p className="text-sm font-medium text-indigo-700">Current JWT (partial view):</p>
                        <p className="font-mono text-xs break-all text-gray-700">{token.substring(0, 40)}...</p>
                    </div>

                    <p className="pt-4 text-gray-600">
                        The key takeaway: Every request to a protected route (like the one above) must include the token in the **Authorization: Bearer** header.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser