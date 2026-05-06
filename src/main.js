import './style.css'
import { initializeJokesApp } from './jokesApp.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="header">
    <h1>😄 Jokes Viewer</h1>
    <p>Get ready to laugh with hilarious jokes!</p>
    <div class="controls">
      <button id="new-joke-btn" class="btn btn-primary">🎲 New Joke</button>
      <button id="copy-btn" class="btn btn-secondary">📋 Copy Joke</button>
    </div>
  </header>
  <main id="jokes-container" class="jokes-display">
    <div class="loading">Loading jokes...</div>
  </main>
`

const elements = {
  container: document.querySelector('#jokes-container'),
  newJokeBtn: document.getElementById('new-joke-btn'),
  copyBtn: document.getElementById('copy-btn')
}

initializeJokesApp(elements)
