import { trace } from '@opentelemetry/api';
import { getUserRepos, fetchPage } from '../services/github.service.js';

const tracer = trace.getTracer('github-controller');

export const getUserReposHandler = async (req, res) => {
  const span = tracer.startSpan('getUserReposHandler');
  try {
    const { username } = req.params;
    let token = req.query.token; 
    const authHeader = req.headers['authorization'];
    if (!token && authHeader) {
        token = authHeader.replace('Bearer ', '').trim();
    }
    const { page, per_page } = req.query;
    if (page) {
      const pageNum = parseInt(page, 10) || 1;
      const perPage = per_page ? parseInt(per_page, 10) : 10;
      const headers = {}
      if (token) headers.Authorization = `token ${token}`
      const baseUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos`
      const pageResult = await fetchPage(baseUrl, pageNum, perPage, { headers })
      res.status(200).json(pageResult.data)
    } else {
      const repos = await getUserRepos(username, token);
      res.status(200).json(repos);
    }
  } catch (error) {
    console.error('getUserReposHandler error', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  } finally {
    span.end();
  }
};
