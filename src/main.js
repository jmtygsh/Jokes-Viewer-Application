import './style.css'
import fetchData from './data.js'

document.querySelector('#app').innerHTML = `
  <header class="header">
    <h1>Quote Gallery</h1>
    <p>Discover inspiring thoughts from great minds</p>
  </header>
  <main id="quotes-container" class="quotes-grid">
    <div class="loading">Loading quotes...</div>
  </main>
`

async function renderQuotes() {
  const container = document.querySelector('#quotes-container')
  container.innerHTML = '<div class="loading">Loading quotes...</div>'
  try {
    const response = await fetchData()
    const quotes = response.data.data

    if (!quotes || quotes.length === 0) {
      container.innerHTML = '<div class="error">No quotes found.</div>'
      return
    }

    container.innerHTML = quotes.map(quote => `
      <div class="quote-card">
        <div class="quote-content">
          <span class="quote-icon">"</span>
          <p class="quote-text">${quote.content}</p>
        </div>
        <div class="quote-author">
          <span class="author-name">— ${quote.author}</span>
          ${quote.tags && quote.tags.length > 0 ? `
            <div class="quote-tags">
              ${quote.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')
  } catch (error) {
    console.error('Error fetching quotes:', error)
    container.innerHTML = '<div class="error">Failed to load quotes. Please try again later.</div>'
  }
}

renderQuotes()
