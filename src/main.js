import './style.css'
import { initializeJokesApp } from './jokesApp.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="header">
    <h1>😄 Jokes Viewer</h1>
    <p>Enjoy a collection of jokes from the API.</p>
  </header>
  <main id="jokes-container" class="jokes-display">
    <div class="loading">Loading jokes...</div>
  </main>
`

const elements = {
  container: document.querySelector('#jokes-container')
}

initializeJokesApp(elements)
