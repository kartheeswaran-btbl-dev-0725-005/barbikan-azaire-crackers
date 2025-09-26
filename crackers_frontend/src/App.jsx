import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { SnackbarProvider } from 'notistack';

function App() {
	return (
		<SnackbarProvider maxSnack={3}>
			<Routes>
				<Route path='/dashboard' element={<Dashboard />} />
			</Routes>
		</SnackbarProvider>
	);
}

export default App;
