import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux-config/store'
import App from './App'
import { injectGlobalStyles } from './utils/styleUtils'

// ─── Global styles (replaces index.css) ────────────────────────────────────
injectGlobalStyles(`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* ── Keyframe animations used by Admin logo ── */
  @keyframes animate {
    0%   { transform: rotateY(0deg); }
    50%  { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }

  @keyframes fallIn {
    0%   { transform: translateY(-200px); opacity: 0; }
    50%  { opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .rotating-logo-admin {
    animation: animate 5s infinite ease-in-out;
  }

  .site-logo-admin {
    animation: fallIn 1.5s ease-in-out;
  }
`)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
