import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const languages = ['cpp', 'javascript', 'java']; // use same order as in defaultValues

const ProblemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum([
        'array', 'string', 'linked list', 'tree', 'graph',
        'dynamic programming', 'greedy', 'backtracking',
        'sorting', 'searching', 'hash table'
    ]),

    VisibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Description is required'),
        })
    ).min(1, 'Atleast one visible test cases are Required'),
    HiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'input is required'),
            output: z.string().min(1, 'Output is required'),
        })
    ).min(1, 'Atleast one hidden test cases are Required'),

    startCode: z.array(
        z.object({
            language: z.enum(['cpp', 'javascript', 'java']),
            initialCode: z.string().min(1, 'Initial Code is required'),
        })
    ).length(3, 'All three langauges are required'),

    referenceSolutions: z.array(
        z.object({
            language: z.enum(['cpp', 'javascript', 'java']),
            completeCode: z.string().min(1, 'Complete Code is required'),
        })
    ).length(3, 'All three langauges are required')
});



function AdminPanel() {

    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(ProblemSchema),
        defaultValues: {
            startCode: [
                { language: 'cpp', initialCode: '' },
                { language: 'javascript', initialCode: '' },
                { language: 'java', initialCode: '' },
            ],
            referenceSolutions: [
                { language: 'cpp', completeCode: '' },
                { language: 'javascript', completeCode: '' },
                { language: 'java', completeCode: '' },
            ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'VisibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'HiddenTestCases'
    });


    const onSubmit = async (data) => {
        try {
            console.log(data);
            await axiosClient.post('/problem/create', data);
            alert('Problem created Successfully');
            navigate('/');
        }
        catch (error) {
            alert(`Error:${error.response?.data?.message || error.message}`);
        }
    }

    return (
        <div className='container mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-6'>Create New Problem</h1>
            <button
                onClick={() => navigate('/Admin')}
                className="px-4 py-2 mb-4 ml-260 mt-0 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Go Back
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='card bg-base-100 shadow-lg p-6'>
                    <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
                    <div className='space-y-4'>
                        <div className='form-control '>
                            <label className='label'>
                                <span className='label-text ml-20'>Title</span>
                            </label>
                            <input
                                {...register('title')}
                                className={` w-3/4 ml-4 mt-5 input input-bordered ${errors.title && 'input-error'}`}
                            />
                            {
                                errors.title && (
                                    <span className='text-error'>{errors.title.message}</span>
                                )
                            }

                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Description</span>
                            </label>
                            <input
                                {...register('description')}
                                className={`ml-4 textarea textarea-bordered h-50 w-full mt-4 ${errors.description && 'input-error'}`}
                            />
                            {
                                errors.description && (
                                    <span className='text-error'>{errors.description.message}</span>
                                )
                            }

                        </div>
                        <div className='flex gap-4'>

                            <div className='form-control w-1/2'>
                                <label className='label'>
                                    <span className='label-text ml-25'>Difficulty</span>
                                </label>
                                <select
                                    {...register('difficulty')}
                                    className={`ml-4 select select-bordered ${errors.difficulty && 'select-error'}`}
                                >
                                    <option value="easy">easy</option>
                                    <option value="medium">medium</option>
                                    <option value="hard">hard</option>

                                </select>
                            </div>
                            <div className='form-control w-1/2'>
                                <label className='label'>
                                    <span className='label-text'>Tag</span>
                                </label>
                                <select
                                    {...register('tags')}
                                    className={`ml-4 select select-bordered ${errors.tags && 'select-error'}`}
                                >
                                    <option value="array">Array</option>
                                    <option value="linked list">Linked List</option>
                                    <option value="graph">Graph</option>
                                    <option value="dynamic programming">Dynamic Programming</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {testcases} */}

                <div className='card bg-base-100 shadow-lg p-6'>
                    <h2 className='text-xl font-semibold mb-4 '>Test Cases</h2>

                    <div className='space-y-4 mb-6'>
                        <div className='flex justify-between items-center'>
                            <h3 className='font-medium'>Visible TestCases</h3>
                            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                className='btn btn-sm btn-primary'>
                                Add VisibleTestCases
                            </button>
                        </div>
                        {visibleFields.map((field, index) => (
                            <div key={field.id} className='border p-4 rounded-lg space-y-2'>
                                <div className='flex justify-end'>
                                    <button type="button"
                                        onClick={() => removeVisible(index)}
                                        className='btn btn-xs btn-error'>
                                        Remove
                                    </button>
                                </div>
                                <input
                                    {...register(`VisibleTestCases.${index}.input`)}
                                    className='input input-bordered w-full'
                                    placeholder='input'
                                >
                                </input>
                                <input
                                    {...register(`VisibleTestCases.${index}.output`)}
                                    className='input input-bordered w-full'
                                    placeholder='Output'
                                >
                                </input>

                                <textarea
                                    {...register(`VisibleTestCases.${index}.explanation`)}
                                    placeholder='Explanation'
                                    className='textarea textarea-bordered w-full'>
                                </textarea>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='card bg-base-100 shadow-lg p-6'>
                    <h2 className='text-xl font-semibold mb-4 '>Test Cases</h2>

                    <div className='space-y-4 mb-6'>
                        <div className='flex justify-between items-center'>
                            <h3 className='font-medium'>Hidden TestCases</h3>
                            <button type="button" onClick={() => appendHidden({ input: '', output: '', explanation: '' })}
                                className='btn btn-sm btn-primary'>
                                Add HiddenTestCases
                            </button>
                        </div>
                        {hiddenFields.map((field, index) => (
                            <div key={field.id} className='border p-4 rounded-lg space-y-2'>
                                <div className='flex justify-end'>
                                    <button type="button"
                                        onClick={() => removeHidden(index)}
                                        className='btn btn-xs btn-error'>
                                        Remove
                                    </button>
                                </div>
                                <input
                                    {...register(`HiddenTestCases.${index}.input`)}
                                    className='input input-bordered w-full'
                                    placeholder='input'
                                >
                                </input>
                                <input
                                    {...register(`HiddenTestCases.${index}.output`)}
                                    className='input input-bordered w-full'
                                    placeholder='output'
                                >
                                </input>

                            </div>
                        ))}
                    </div>

                </div>

                <div className='card bg-base-100 shadow-lg p-6'>
                    {languages.map((lang, index) => (
                        <div key={lang} className='space-y-2'>
                            <h3 className='font-medium'>{lang}</h3>

                            <input
                                type="hidden"
                                value={lang}
                                {...register(`startCode.${index}.language`)}
                            />
                            <input
                                type="hidden"
                                value={lang}
                                {...register(`referenceSolutions.${index}.language`)}
                            />

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Initial Code</span>
                                </label>
                                <pre className='bg-base-300 p-4 rounded-lg'>
                                    <textarea
                                        {...register(`startCode.${index}.initialCode`)}
                                        className='w-full bg-transparent font-mono'
                                        rows={6}
                                    />
                                </pre>
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Reference Code</span>
                                </label>
                                <pre className='bg-base-300 p-4 rounded-lg'>
                                    <textarea
                                        {...register(`referenceSolutions.${index}.completeCode`)}
                                        className='w-full bg-transparent font-mono'
                                        rows={6}
                                    />
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>


                <button type='submit' className='btn btn-primary w-full'>
                    Create Problem
                </button>


            </form>

        </div>
    )
}

export default AdminPanel