import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginUser } from '../authSlice'; // Assuming you have an authSlice for authentication
import { useNavigate, NavLink } from 'react-router'; // Assuming you are using react-router for navigation
import { useEffect, useState } from 'react';

const schema = z.object({
    email_id: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export default function Login() {

    const [formSubmitted, setFormSubmitted] = useState(false);


    const dispatch = useDispatch();
    const { isAuthenticated, error } = useSelector((state) => state.auth);
    const navigate = useNavigate(); // Assuming you are using react-router for navigation
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
        setFormSubmitted(true);
        dispatch(loginUser(data)); // Dispatch the login action with form data
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to home page if authenticated
        }
    }
        , [isAuthenticated]); // Dependency array to run effect when isAuthenticated changes

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-gray-100 p-8 rounded-xl shadow-md space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-blue-700">Leetcode</h2>
                {/* Email */}

                {formSubmitted && error && (
                    <p className="text-red-600 text-center font-medium -mt-4">
                        Invalid Credentials / Unregistered Email
                    </p>
                )}
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
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-blue-800">Password</label>
                    <input
                        {...register("password")}
                        placeholder="Enter your Password"
                        type="password"
                        className="border border-gray-300 rounded px-4 text-black py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                >
                    Sign In
                </button>
                <div className="mt-2 ml-16">
                    <span className="text-gray-700"> Don't have an account?</span>
                    <button
                        type="button"
                        className="ml-2 text-blue-600 font-semibold hover:underline transition duration-150"
                    >
                        <NavLink to="/SignUp" className="link link-primary">
                            SignUp
                        </NavLink>
                    </button>
                </div>
                <div className="text-center">
                    <NavLink to="/forget-password" className="text-blue-500 hover:underline">
                        Forgot Password?
                    </NavLink>
                </div>

            </form>
        </div>
    );
}
