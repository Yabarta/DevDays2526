import axios from 'axios'

export async function fetchAllPages(startUrl, axiosConfig = {}, extractPageData = (res) => res.data) {
  const results = []
  let nextUrl = startUrl
  const config = { ...axiosConfig }

  while (nextUrl) {
    const res = await axios.get(nextUrl, config)

    const pageData = extractPageData(res)
    if (Array.isArray(pageData)) {
      results.push(...pageData)
    } else {
      results.push(pageData)
    }

    const link = res.headers && res.headers.link

    if (link) {
      const nextLink = link.match(/<([^>]+)>;\s*rel="next"/)
      if (nextLink) {
        nextUrl = nextLink[1]
      } else {
        nextUrl = null
      }
    } else {
      nextUrl = null
    }
  }

  return results
}

export async function fetchPage(baseUrl, page = 1, perPage = 10, axiosConfig = {}) {
  const url = new URL(baseUrl)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('page', String(page))

  const res = await axios.get(url.toString(), axiosConfig)
  return { data: res.data, headers: res.headers }
}

const crearConfig = (token) => {
    return token ? { headers: { Authorization: `token ${token}` } } : {}
}

export async function getUserRepos(username, token) {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=10`
  return fetchAllPages(url, crearConfig(token))
}

export async function listOrgRepos(org, token) {
  const url = `https://api.github.com/orgs/${org}/repos?per_page=10`
  return fetchAllPages(url, crearConfig(token))
}
export default {
  fetchAllPages,
  fetchPage,
  getUserRepos,
  listOrgRepos,
}
