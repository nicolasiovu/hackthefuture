import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    company: null
}

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setCompany: (state, action) => {
            state.company = action.payload;
        }
    }
})

export const { setCompany } = navSlice.actions;

export const selectCompany = (state) => state.nav.company;

export default navSlice.reducer;