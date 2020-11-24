import React from 'react'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router } from 'react-router-dom'
import { SnackbarProvider as SnackbarContextProvider } from './contexts/SnackbarContext'
import Routes from './routes'

function App() {
    return (
        <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <SnackbarContextProvider>
                <Router>
                    <Routes />
                </Router>
            </SnackbarContextProvider>
        </SnackbarProvider>
    )
}
export default App
