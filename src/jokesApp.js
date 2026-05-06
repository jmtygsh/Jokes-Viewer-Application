import fetchData from './data.js'

const state = {
  currentJoke: null,
  totalPages: null,
  laughsByJokeId: new Map()
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getJokeText(joke) {
  if (joke.setup) return joke.setup
  if (joke.content) return joke.content
  if (joke.joke) return joke.joke
  return ''
}

function getLaughCount(jokeId) {
  return state.laughsByJokeId.get(jokeId) || 0
}

function updateLaughButton(button, count) {
  button.innerHTML = `😂 Laugh (${count})`
  button.classList.add('laughing')
  setTimeout(() => button.classList.remove('laughing'), 300)
}

function createCategoryTags(joke) {
  const categories = Array.isArray(joke.categories) ? joke.categories : []
  let html = ''

  for (const category of categories) {
    html += `<span class="joke-category">${category}</span>`
  }

  return html
}

function buildJokeHTML(joke) {
  const jokeText = getJokeText(joke)
  const hasDelivery = !!joke.delivery
  const categoryTags = createCategoryTags(joke)
  const laughCount = getLaughCount(joke.id)
  let deliveryPart = ''

  if (hasDelivery) {
    deliveryPart = `
      <div class="joke-delivery">
        <span class="joke-emoji">😄</span>
        <p class="joke-text">${joke.delivery}</p>
      </div>
    `
  }

  let extraCategory = ''
  if (joke.category) {
    extraCategory = `<span class="joke-category">${joke.category}</span>`
  }

  let jokeType = ''
  if (joke.type) {
    jokeType = `<span class="joke-type">${joke.type}</span>`
  }

  let jokeId = ''
  if (joke.id) {
    jokeId = `<span class="joke-type">#${joke.id}</span>`
  }

  return `
    <div class="joke-card">
      <div class="joke-content">
        <div class="joke-setup">
          <span class="joke-emoji">🎯</span>
          <p class="joke-text">${jokeText}</p>
        </div>
        ${deliveryPart}
      </div>
      <div class="joke-actions">
        <button id="laugh-btn" class="btn btn-laugh">😂 Laugh (${laughCount})</button>
        <div class="joke-meta">
          ${categoryTags}
          ${extraCategory}
          ${jokeType}
          ${jokeId}
        </div>
      </div>
    </div>
  `
}

async function getRandomJoke() {
  let page = 1
  if (state.totalPages) {
    page = randomNumber(1, state.totalPages)
  }

  const { data: payload } = await fetchData({ page, limit: 10 })
  const jokes = payload?.data || []
  state.totalPages = payload?.totalPages || state.totalPages

  if (!jokes.length) {
    return null
  }

  const candidates = jokes.filter((joke) => joke.id !== state.currentJoke?.id)
  let selectionPool = jokes
  if (candidates.length) {
    selectionPool = candidates
  }

  const randomIndex = randomNumber(0, selectionPool.length - 1)
  return selectionPool[randomIndex]
}

function attachJokeListeners(container) {
  const laughBtn = container.querySelector('#laugh-btn')

  laughBtn?.addEventListener('click', () => {
    if (!state.currentJoke?.id) {
      return
    }

    const nextCount = getLaughCount(state.currentJoke.id) + 1
    state.laughsByJokeId.set(state.currentJoke.id, nextCount)
    updateLaughButton(laughBtn, nextCount)
  })
}

async function copyJoke(copyBtn) {
  if (!state.currentJoke) {
    return
  }

  let jokeText = getJokeText(state.currentJoke)
  if (state.currentJoke.delivery) {
    jokeText += `\n\n${state.currentJoke.delivery}`
  }

  try {
    await navigator.clipboard.writeText(jokeText)
    copyBtn.innerHTML = '✅ Copied!'
    setTimeout(() => {
      copyBtn.innerHTML = '📋 Copy Joke'
    }, 2000)
  } catch (error) {
    console.error('Failed to copy joke:', error)
  }
}

async function renderJoke(container) {
  container.innerHTML = '<div class="loading">Loading jokes...</div>'

  try {
    const joke = await getRandomJoke()

    if (!joke) {
      container.innerHTML = '<div class="error">No jokes found.</div>'
      return
    }

    state.currentJoke = joke
    container.innerHTML = buildJokeHTML(joke)
    attachJokeListeners(container)
  } catch (error) {
    console.error('Error fetching jokes:', error)
    container.innerHTML = '<div class="error">Failed to load jokes. Please try again later.</div>'
  }
}

export const initializeJokesApp = ({ container, newJokeBtn, copyBtn }) => {
  if (newJokeBtn) {
    newJokeBtn.addEventListener('click', () => {
      renderJoke(container)
    })
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyJoke(copyBtn)
    })
  }

  renderJoke(container)
}
