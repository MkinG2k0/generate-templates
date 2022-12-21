import { Error } from '@ReduxHelper'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFileName = createAsyncThunk<
	string,
	void,
	{ rejectValue: string }
>('fetch/example', async function (_, { rejectWithValue }) {
	const data = 'fetch_return'
	Error(data, rejectWithValue)

	return data
})
