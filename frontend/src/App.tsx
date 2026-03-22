import Register from './components/Register';
import Home from './components/Home';
import RootLayout from './components/RootLayout';
import CreatePost from './components/CreatePost';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootLayout>
  );
}

export default App;