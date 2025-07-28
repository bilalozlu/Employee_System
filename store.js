import { configureStore, createSlice } from '@reduxjs/toolkit';

const persistedState = JSON.parse(localStorage.getItem('employees') || 'null');
const initialState = persistedState || { list: [], page: 1, perPage: 10 };

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee(state, action) { state.list.push(action.payload); },
    updateEmployee(state, action) {
      const idx = state.list.findIndex(e => e.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    deleteEmployee(state, action) {
      state.list = state.list.filter(e => e.id !== action.payload);
    },
    setPage(state, action) { state.page = action.payload; }
  }
});

export const { addEmployee, updateEmployee, deleteEmployee, setPage } = employeesSlice.actions;
export const store = configureStore({ reducer: employeesSlice.reducer });

store.subscribe(() => {
  localStorage.setItem('employees', JSON.stringify(store.getState()));
});