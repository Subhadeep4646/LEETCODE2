import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { registerUser } from '../authSlice'; // Assuming you have an authSlice for authentication
import { NavLink, useNavigate } from 'react-router'; // Assuming you are using react-router for navigation
import { useEffect, useState } from 'react';
// ✅ Zod validation schema
const schema = z.object({
    firstname: z.string().min(3, "First name must be at least 3 characters"),
    email_id: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);


    const dispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
    //The component will automatically re-render every time any of the selected values (isAuthenticated, loading, or error) change in the Redux store.
    const navigate = useNavigate(); // Assuming you are using react-router for navigation

    const onSubmit = (data) => {
        console.log(data);
        setFormSubmitted(true);
        dispatch(registerUser(data));
        // Dispatch the register action with form data
        //this will go to store and then to the userdata of authSlice where the register action is defined
        //then it will call the API to register the user using axiosClient.post('/user/register', userData);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to home page if authenticated
        }
    }
        , [isAuthenticated]); // Dependency array to run effect when isAuthenticated changes
    // useEffect to handle loading and error states

    return (

        <div className="flex items-center justify-center min-h-screen px-4">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`w-full max-w-md p-8 rounded-xl shadow-md space-y-6 
                    ${error ? 'bg-gray-100' : 'bg-gray-100'}`}
            >
                <h2 className="text-3xl font-bold text-center text-blue-600">Leetcode</h2>
                {formSubmitted && error && (
                    <p className="text-red-600 text-center font-medium -mt-4">
                        Email already registered
                    </p>
                )}

                {/* First Name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-blue-700">First Name</label>
                    <input
                        {...register("firstname")}
                        placeholder="Enter your First Name"
                        className="border text-black border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.firstname && (
                        <span className="text-sm text-red-500 mt-1">
                            {errors.firstname.message}
                        </span>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-indigo-500">Email</label>
                    <input
                        {...register("email_id")}
                        placeholder="Enter your Email"
                        type="email"
                        className="border text-black border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email_id && (
                        <span className="text-sm text-red-500 mt-1">
                            {errors.email_id.message}
                        </span>
                    )}
                </div>

                {/* Password */}
                {/* Password */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-blue-800">Password</label>
                    <div className="relative w-full">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your Password"
                            className="border border-gray-300 text-black rounded px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {
                                showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.181-3.362m3.403-2.341A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.978 9.978 0 01-4.042 5.048M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 20m0 0l2.364-2.364M6 20l2.364-2.364" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-sm text-red-500 mt-1">
                            {errors.password.message}
                        </span>
                    )}
                </div>


                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >

                    Sign Up
                </button>
                <div className="mt-2 ml-16">
                    <span className="text-gray-700">Already have an account?</span>
                    <button
                        type="button"
                        className="ml-2 text-blue-600 font-semibold hover:underline transition duration-150"
                    >
                        <NavLink to="/login" className="link link-primary">
                            Login
                        </NavLink>
                    </button>
                </div>

            </form >
        </div >
    );
}









// function SignUp() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const user = { name, email, password };
//         console.log('User Submitted:', user); // Add logic here to handle signup
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-80 h-70 border-1 p-5 rounded-lg">
//                 <input
//                     type="text"
//                     value={name}
//                     placeholder="Enter your first name"
//                     onChange={(e) => setName(e.target.value)}
//                     className="border p-2"
//                 />
//                 <input
//                     type="email"
//                     value={email}
//                     placeholder="Enter your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="border p-2"
//                 />
//                 <input
//                     type="password"
//                     value={password}
//                     placeholder="Enter your password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border p-2"
//                 />
//                 <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//                     Sign Up
//                 </button>
//             </form>
//         </div>
//     );
// }

