import { useNavigate } from "react-router-dom";

const SessionExpiredModal = ({ open }) => {

    const navigate = useNavigate();

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-8 w-[400px]">

                <h2 className="text-2xl font-bold mb-4">
                    Session Expired
                </h2>

                <p className="text-gray-500 mb-6">
                    Your session has expired.
                    Please login again.
                </p>

                <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary w-full"
                >
                    Login Again
                </button>

            </div>

        </div>
    );

};

export default SessionExpiredModal;