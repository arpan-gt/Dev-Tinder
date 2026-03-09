import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    removeUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});
export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
