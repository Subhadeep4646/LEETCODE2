import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
      try {
        const response = await axiosClient.post('/user/register', userData);
        return response.data;
      } catch (error) {
        // Return a serializable error object
        return rejectWithValue({
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data // Only if you need the response body
        });
      }
    }
  );

export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post('/user/login', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post('/user/logout');
            return null; // Logout doesn't return user data
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const checkAuth= createAsyncThunk(
    'auth/checkAuth',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosClient.get('/user/checkAuth');
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name:'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        darkMode: false, // <-- added this

    }, 
    reducers: {

        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem("theme", state.darkMode ? "dark" : "light");
          },
          setTheme: (state, action) => {
            state.darkMode = action.payload;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = !!action.payload;
                state.isAuthenticated = !!action.payload; // Update authentication status
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                // Now action.payload is guaranteed to be serializable
                if (action.payload) {
                  if (action.payload.code === 'ERR_NETWORK') {
                    state.error = 'Network error: Could not connect to server';
                  } else {
                    state.error = action.payload.message || 'Registration failed';
                  }
                } else {
                  state.error = 'Registration failed';
                }
              })

            
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = !!action.payload;
                console.log(action.payload);
                state.isAuthenticated = !!action.payload; // Update authentication status
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
                state.isAuthenticated = false; // Ensure unauthenticated status on failure
                state.user = null; // Clear user on failure
            })


            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null; // Clear user on logout
                state.isAuthenticated = false; // Update authentication status
    
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Logout failed';
                state.isAuthenticated = false; // Keep unauthenticated status if logout fails
            })
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Set user if authenticated
                state.isAuthenticated = !!action.payload; // Update authentication status
                if (action.payload) {
                    state.error = null; // Clear error if authenticated
                } else {
                    state.error = 'User not authenticated'; // Set error if not authenticated
                }
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || 'Authentication check failed';
            });
            

    },
});

export default authSlice.reducer;

export const { toggleTheme, setTheme, /* other actions */ } = authSlice.actions;
