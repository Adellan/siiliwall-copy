import React, {
    useState,
    createContext,
    useCallback,
    useContext,
    useEffect,
} from 'react'
import { useSnackbar } from 'notistack'

const SnackbarContext = createContext(null)

const SnackbarProvider = ({ children }) => {
    const [snackbarMessage, setSnackbarMessage] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const handleSetSnachbarMessage = useCallback((value) => {
        setSnackbarMessage(value)
    }, [])

    useEffect(() => {
        if (snackbarMessage) {
            enqueueSnackbar(snackbarMessage)
            setSnackbarMessage(null)
        }
    }, [enqueueSnackbar, snackbarMessage])

    return (
        <SnackbarContext.Provider
            value={{ snackbarMessage, setSnackbarMessage: handleSetSnachbarMessage }}
        >
            { children }
        </SnackbarContext.Provider>
    )
}

const useSnackbarContext = () => {
    const context = useContext(SnackbarContext)
    return context
}

export { SnackbarProvider, useSnackbarContext }
