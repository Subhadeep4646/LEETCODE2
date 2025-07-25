import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';

const languages = ['cpp', 'javascript', 'java'];

const ProblemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum([
        'array', 'string', 'linked list', 'tree', 'graph',
        'dynamic programming', 'greedy', 'backtracking',
        'sorting', 'searching', 'hash table'
    ]),
    VisibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case is required'),
    HiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case is required'),
    startCode: z.array(
        z.object({
            language: z.enum(['cpp', 'javascript', 'java']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'Start code for all languages is required'),
    referenceSolutions: z.array(
        z.object({
            language: z.enum(['cpp', 'javascript', 'java']),
            completeCode: z.string().min(1, 'Reference solution is required')
        })
    ).length(3, 'Reference solutions for all languages is required')
});

const AdminUpdatePage = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(ProblemSchema),
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'easy',
            tags: 'array',
            VisibleTestCases: [{ input: '', output: '', explanation: '' }],
            HiddenTestCases: [{ input: '', output: '' }],
            startCode: languages.map(lang => ({ language: lang, initialCode: '' })),
            referenceSolutions: languages.map(lang => ({ language: lang, completeCode: '' }))
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({ control, name: 'VisibleTestCases' });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({ control, name: 'HiddenTestCases' });

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axiosClient.get(`/problem/getProblem/${problemId}`);
                const data = res.data.validId;

                // Format the data to match our form structure
                const formattedData = {
                    title: data.title,
                    description: data.description,
                    difficulty: data.difficulty,
                    tags: data.tags,
                    VisibleTestCases: data.VisibleTestCases,
                    HiddenTestCases: data.HiddenTestCases,
                    startCode: languages.map(lang => ({
                        language: lang,
                        initialCode: data.startCode.find(c => c.language === lang)?.initialCode || ''
                    })),
                    referenceSolutions: languages.map(lang => ({
                        language: lang,
                        completeCode: data.referenceSolutions.find(c => c.language === lang)?.completeCode || ''
                    }))
                };

                reset(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load problem:', err);
                setSubmitError('Failed to load problem');
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemId, reset]);

    const onSubmit = async (data) => {
        try {
            setSubmitError('');
            await axiosClient.put(`/problem/update/${problemId}`, data);
            alert('Problem updated successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Update error:', error);
            setSubmitError(error.response?.data?.message || error.message || 'Failed to update problem');
        }
    };

    if (loading) return <div className='p-6 text-lg'>Loading...</div>;

    return (
        <div className='container mx-auto p-6 max-w-6xl'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold'>Update Problem</h1>
                <button
                    onClick={() => navigate('/admin')}
                    className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
                >
                    Go Back
                </button>
            </div>

            {submitError && (
                <div className='alert alert-error mb-6'>
                    <div className='flex-1'>
                        <label className='text-white'>{submitError}</label>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Basic Information Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Title */}
                    <div>
                        <label className='block font-medium mb-1'>Title*</label>
                        <input
                            type='text'
                            {...register('title')}
                            className='input input-bordered w-full'
                        />
                        {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className='block font-medium mb-1'>Difficulty*</label>
                        <select {...register('difficulty')} className='select select-bordered w-full'>
                            <option value='easy'>Easy</option>
                            <option value='medium'>Medium</option>
                            <option value='hard'>Hard</option>
                        </select>
                        {errors.difficulty && <p className='text-red-500 text-sm mt-1'>{errors.difficulty.message}</p>}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className='block font-medium mb-1'>Tag*</label>
                        <select {...register('tags')} className='select select-bordered w-full'>
                            <option value='array'>Array</option>
                            <option value='string'>String</option>
                            <option value='linked list'>Linked List</option>
                            <option value='tree'>Tree</option>
                            <option value='graph'>Graph</option>
                            <option value='dynamic programming'>Dynamic Programming</option>
                            <option value='greedy'>Greedy</option>
                            <option value='backtracking'>Backtracking</option>
                            <option value='sorting'>Sorting</option>
                            <option value='searching'>Searching</option>
                            <option value='hash table'>Hash Table</option>
                        </select>
                        {errors.tags && <p className='text-red-500 text-sm mt-1'>{errors.tags.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className='block font-medium mb-1'>Description*</label>
                    <textarea
                        {...register('description')}
                        rows={6}
                        className='textarea textarea-bordered w-full'
                    />
                    {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
                </div>

                {/* Test Cases Sections */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Visible Test Cases */}
                    <div className='border p-4 rounded-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='font-bold'>Visible Test Cases*</h3>
                            <button
                                type='button'
                                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                className='btn btn-sm btn-primary'
                            >
                                Add
                            </button>
                        </div>
                        {visibleFields.map((field, index) => (
                            <div key={field.id} className='mb-4 space-y-2 p-4 border rounded bg-base-200'>
                                <div>
                                    <label className='text-sm'>Input*</label>
                                    <textarea
                                        {...register(`VisibleTestCases.${index}.input`)}
                                        className='textarea textarea-bordered w-full'
                                        rows={2}
                                    />
                                    {errors.VisibleTestCases?.[index]?.input && (
                                        <p className='text-red-500 text-sm'>{errors.VisibleTestCases[index].input.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-sm'>Output*</label>
                                    <textarea
                                        {...register(`VisibleTestCases.${index}.output`)}
                                        className='textarea textarea-bordered w-full'
                                        rows={2}
                                    />
                                    {errors.VisibleTestCases?.[index]?.output && (
                                        <p className='text-red-500 text-sm'>{errors.VisibleTestCases[index].output.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-sm'>Explanation*</label>
                                    <textarea
                                        {...register(`VisibleTestCases.${index}.explanation`)}
                                        className='textarea textarea-bordered w-full'
                                        rows={2}
                                    />
                                    {errors.VisibleTestCases?.[index]?.explanation && (
                                        <p className='text-red-500 text-sm'>{errors.VisibleTestCases[index].explanation.message}</p>
                                    )}
                                </div>
                                <button
                                    type='button'
                                    onClick={() => removeVisible(index)}
                                    className='btn btn-sm btn-error mt-2'
                                    disabled={visibleFields.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {errors.VisibleTestCases?.message && (
                            <p className='text-red-500 text-sm'>{errors.VisibleTestCases.message}</p>
                        )}
                    </div>

                    {/* Hidden Test Cases */}
                    <div className='border p-4 rounded-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='font-bold'>Hidden Test Cases*</h3>
                            <button
                                type='button'
                                onClick={() => appendHidden({ input: '', output: '' })}
                                className='btn btn-sm btn-primary'
                            >
                                Add
                            </button>
                        </div>
                        {hiddenFields.map((field, index) => (
                            <div key={field.id} className='mb-4 space-y-2 p-4 border rounded bg-base-200'>
                                <div>
                                    <label className='text-sm'>Input*</label>
                                    <textarea
                                        {...register(`HiddenTestCases.${index}.input`)}
                                        className='textarea textarea-bordered w-full'
                                        rows={2}
                                    />
                                    {errors.HiddenTestCases?.[index]?.input && (
                                        <p className='text-red-500 text-sm'>{errors.HiddenTestCases[index].input.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-sm'>Output*</label>
                                    <textarea
                                        {...register(`HiddenTestCases.${index}.output`)}
                                        className='textarea textarea-bordered w-full'
                                        rows={2}
                                    />
                                    {errors.HiddenTestCases?.[index]?.output && (
                                        <p className='text-red-500 text-sm'>{errors.HiddenTestCases[index].output.message}</p>
                                    )}
                                </div>
                                <button
                                    type='button'
                                    onClick={() => removeHidden(index)}
                                    className='btn btn-sm btn-error mt-2'
                                    disabled={hiddenFields.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {errors.HiddenTestCases?.message && (
                            <p className='text-red-500 text-sm'>{errors.HiddenTestCases.message}</p>
                        )}
                    </div>
                </div>

                {/* Code Editors */}
                <div className='card bg-base-100 shadow-lg p-6 space-y-6'>
                    <h2 className='text-xl font-bold'>Code Templates and Solutions</h2>

                    {languages.map((lang, index) => (
                        <div key={lang} className='space-y-4 border-b pb-6 last:border-b-0'>
                            <h3 className='font-bold text-lg capitalize'>{lang}</h3>

                            <input type="hidden" {...register(`startCode.${index}.language`)} />
                            <input type="hidden" {...register(`referenceSolutions.${index}.language`)} />

                            <div>
                                <label className='block font-medium mb-1'>Initial Code*</label>
                                <div className='bg-base-300 p-4 rounded-lg'>
                                    <textarea
                                        {...register(`startCode.${index}.initialCode`)}
                                        className='w-full bg-transparent font-mono textarea'
                                        rows={8}
                                    />
                                </div>
                                {errors.startCode?.[index]?.initialCode && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.startCode[index].initialCode.message}</p>
                                )}
                            </div>

                            <div>
                                <label className='block font-medium mb-1'>Reference Solution*</label>
                                <div className='bg-base-300 p-4 rounded-lg'>
                                    <textarea
                                        {...register(`referenceSolutions.${index}.completeCode`)}
                                        className='w-full bg-transparent font-mono textarea'
                                        rows={8}
                                    />
                                </div>
                                {errors.referenceSolutions?.[index]?.completeCode && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.referenceSolutions[index].completeCode.message}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className='flex justify-end'>
                    <button
                        type='submit'
                        className='btn btn-primary px-8 py-2'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Problem'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminUpdatePage;