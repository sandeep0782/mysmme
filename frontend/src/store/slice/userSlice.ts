
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoadingDialogOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoadingDialogOpen: false,
  isLoggedIn: false,
};

const useSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setIsEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isEmailVerified = false;
      state.isLoggedIn = false;
    },
    toggleLoginDialog: (state) => {
      state.isLoadingDialogOpen = !state.isLoadingDialogOpen;
    },
    authStatus: (state) => {
      state.isLoggedIn = true;
    },
  },
});

export const { setUser, setIsEmailVerified, logout, toggleLoginDialog, authStatus } = useSlice.actions;

export default useSlice.reducer;
