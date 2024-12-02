import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import useAuthStore from "./store/authStore";
import PageLayout from "./layouts/PageLayout/PageLayout";
import useCountCategoryTasks from "./hooks/useCountCategoryTasks";
import { useShallow } from "zustand/shallow";

function App() {
    useCountCategoryTasks();

    const { isLoggedIn, isGuest } = useAuthStore(useShallow((state) => ({
        isLoggedIn: state.isLoggedIn,
        isGuest: state.isGuest,
    })));

    return (
        <PageLayout>
            <Routes>
                <Route
                    path="/"
                    element={
                        isGuest || isLoggedIn ? (
                            <Home />
                        ) : (
                            <Navigate to="/auth" />
                        )
                    }
                />
                <Route
                    path="/auth"
                    element={
                        isGuest || !isLoggedIn ? (
                            <Authentication />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </PageLayout>
    );
}

export default App;