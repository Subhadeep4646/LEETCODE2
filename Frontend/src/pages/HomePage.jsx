import React, { useEffect, useState } from 'react';
import { logoutUser } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Link, useNavigate } from 'react-router';

function HomePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        difficulty: 'all',
        tags: 'all',
        status: 'all'
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all problems
                const problemsResponse = await axiosClient.get('/problem/getAllProblems');
                console.log("All Problems Response:", problemsResponse.data);
                setProblems(problemsResponse.data.problems || []); // Fallback to empty array

                // Fetch solved problems if user is logged in
                if (user) {
                    try {
                        const solvedResponse = await axiosClient.get('/problem/solvedProblemsByUser');
                        console.log("Solved Problems Response:", solvedResponse.data);
                        setSolvedProblems(solvedResponse?.data || []); // Fallback to empty array
                    } catch (solvedError) {
                        console.log("Error fetching solved problems", solvedError);
                        setSolvedProblems([]);
                    }
                }
            } catch (error) {
                console.log("Error fetching data", error);
                setError("Failed to load problems");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    if (loading) return <div className="text-center py-8">Loading problems...</div>;
    if (error) return <div className="text-center py-8 text-error">{error}</div>;
    if (!Array.isArray(problems)) return <div className="text-center py-8">No problems found</div>;

    console.log(problems);

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === "all" || problem.difficulty === filters.difficulty;
        //console.log(problem.tags);

        const tagMatch = filters.tags === "all" || problem.tags.includes(filters.tags);

        const statusMatch =
            filters.status === "all" ||
            (filters.status === "solved" &&
                Array.isArray(solvedProblems) &&
                solvedProblems.some(sp => sp._id === problem._id)
            );

        return difficultyMatch && tagMatch && statusMatch;
    });

    return (
        <div>
            <div className="dropdown dropdown-end  ml-290 mt-2">
                <button onClick={handleLogout} className="hover:bg-red-100 text-red-600 font-semibold">
                    <label tabIndex={0} className="btn m-1">Logout</label>
                </button>
            </div>


            <div className='container mx-auto p-4'>
                <div className='flex flex-wrap gap-4 mt-2 mb-4'>
                    <select className='select select-bordered'
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}>
                        <option value="all">All Problems</option>
                        <option value="solved">Solved Problems</option>
                    </select>

                    <select className='select select-bordered'
                        value={filters.difficulty}
                        onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select className='select select-bordered'
                        value={filters.tags}
                        onChange={e => setFilters({ ...filters, tags: e.target.value })}>
                        <option value="all">All Tags</option>
                        <option value="array">Array</option>
                        <option value="Dp">Dynamic Programming</option>
                        <option value="linkedlist">Linked List</option>
                        <option value="graph">Graph</option>
                    </select>
                    <div>

                        {user && user?.role === 'admin' && (
                            <div className="text-center ">
                                <button
                                    onClick={() => navigate('/Admin')}
                                    className="px-4 py-2 ml-12 mb-0 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Go to Admin Panel
                                </button>
                            </div>
                        )}
                    </div>


                </div>

                <div className='grid gap-4'>
                    {filteredProblems.length === 0 ? (
                        <div className="text-center py-8">No problems match your filters</div>
                    ) : (
                        filteredProblems.map(problem => (
                            <div key={problem._id} className='card bg-base-100 shadow-xl'>
                                <div className='card-body'>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='card-title'>
                                            <Link to={`/problem/${problem._id}`} className="text-blue-600 hover:underline">
                                                {problem.title}
                                            </Link>
                                        </h2>
                                        {solvedProblems.some(sp => sp._id === problem._id) && (
                                            <div className='badge badge-success gap-2'>
                                                ✅ Solved
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex gap-2'>
                                        <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </div>
                                        <div className='badge badge-info '>
                                            {problem.tags.join(' / ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function getDifficultyBadgeColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-error';
        default: return 'badge-neutral';
    }
}

export default HomePage;