import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppProvider } from './context/AppContext';
import { theme } from './styles/Theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';

// Pages
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Friends } from './pages/Friends';
import { Groups } from './pages/Groups';
import { Profile } from './pages/Profile';
import { Calculate } from './pages/Calculate';
import { NewCru } from './pages/NewCru';
import { Option } from './pages/Option';
import { Account } from './pages/Account';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/calculate" element={<Calculate />} />
                <Route path="/newcru" element={<NewCru />} />
                <Route path="/option" element={<Option />} />
                <Route path="/account" element={<Account />} />
                {/* 잘못된 경로는 홈(스플래시)으로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
