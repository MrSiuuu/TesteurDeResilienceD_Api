import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiTestForm from './components/ApiTestForm';
import './styles/global.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<ApiTestForm />} />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;