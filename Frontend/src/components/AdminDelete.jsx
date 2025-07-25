import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const AdminDelete = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/problem/getAllProblems');
            setProblems(data.problems);
        } catch (err) {
            setError('Failed to fetch problems');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;

        try {
            await axiosClient.delete(`/problem/delete/${id}`);
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError('Failed to delete problem');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg my-4">
                <div className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800">🗑️ Delete Coding Problems</h1>
                <p className="text-gray-500 mt-2">Click delete to remove problems permanently.</p>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="table w-full text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Difficulty</th>
                            <th className="p-3 text-left">Tags</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem, index) => (
                            <tr key={problem._id} className="hover:bg-gray-50 transition">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3 font-medium text-blue-500">{problem.title}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Easy'
                                            ? 'bg-green-100 text-green-800'
                                            : problem.difficulty === 'Medium'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td className="p-3 flex flex-wrap gap-2">
                                    {problem.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => handleDelete(problem._id)}
                                        className="btn btn-sm btn-error flex items-center gap-1 hover:scale-105 transition-transform"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={() => navigate('/Admin')}
                    className="px-4 py-2 mt-10 mb-4 ml-140 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default AdminDelete;
