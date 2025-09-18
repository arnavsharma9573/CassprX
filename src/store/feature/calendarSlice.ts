import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CalendarPost {
  id: string;
  brandId: string;
  date: string; // ISO date string
  content: string;
  status: "draft" | "scheduled" | "published";
}

interface CalendarState {
  posts: CalendarPost[];
}

const initialState: CalendarState = {
  posts: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<CalendarPost>) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action: PayloadAction<CalendarPost>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
  },
});

// ✅ Selectors (outside reducers)
export const selectPostsByBrand = (state: { calendar: CalendarState }, brandId: string) =>
  state.calendar.posts.filter((p) => p.brandId === brandId);

export const { addPost, updatePost, deletePost } = calendarSlice.actions;
export default calendarSlice.reducer;
