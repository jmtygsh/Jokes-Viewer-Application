import fetchData from './data.js'

function getJokeText(joke) {
  if (joke.setup) return joke.setup
  if (joke.content) return joke.content
  if (joke.joke) return joke.joke
  return ''
}

async function renderJokes(container) {
  container.innerHTML = '<div class="loading">Loading jokes...</div>'

  try {
    const response = await fetchData()
    const jokes = response?.data?.data || []

    if (!jokes.length) {
      container.innerHTML = '<div class="error">No jokes found.</div>'
      return
    }

    let html = ''
    for (const joke of jokes) {
      const jokeText = getJokeText(joke)
      const hasDelivery = !!joke.delivery
      let categoriesHtml = ''

      if (Array.isArray(joke.categories) && joke.categories.length > 0) {
        for (const category of joke.categories) {
          categoriesHtml += `<span class="joke-category">${category}</span>`
        }
      }

      html += `
        <div class="joke-card">
          <div class="joke-content">
            <div class="joke-setup">
              <span class="joke-emoji">🎯</span>
              <p class="joke-text">${jokeText}</p>
            </div>
            ${hasDelivery ? `
              <div class="joke-delivery">
                <span class="joke-emoji">😄</span>
                <p class="joke-text">${joke.delivery}</p>
              </div>
            ` : ''}
          </div>
          <div class="joke-actions">
            <div class="joke-meta">
              ${categoriesHtml}
              ${joke.id ? `<span class="joke-type">#${joke.id}</span>` : ''}
            </div>
          </div>
        </div>
      `
    }
    container.innerHTML = html
  } catch (error) {
    console.error('Error fetching jokes:', error)
    container.innerHTML = '<div class="error">Failed to load jokes. Please try again later.</div>'
  }
}

export const initializeJokesApp = ({ container }) => {
  renderJokes(container)
}
