import React from "react"
import ReactDOM from "react-dom/client"
// eslint-disable-next-line import/no-unresolved
import App from "./App"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
// eslint-disable-next-line import/no-unresolved
import { CONTENT_NAME_PLURAL } from "./Content"

const titleRef = document.getElementById("contentTitle")
if (titleRef) {
	titleRef.innerHTML = CONTENT_NAME_PLURAL
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
)
