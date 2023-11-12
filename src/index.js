import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './assets/scss/style.scss';
import './assets/scss/st.scss';
import './assets/fonts/circe/stylesheet.css';

if (document.getElementById('root')) {
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(
		<App />
	);
}

