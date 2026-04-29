import client from './client';

export const getTalentPool = (params = {}) => {
  const query = {};
  if (params.track && params.track !== 'All') query.track = params.track;
  if (params.min_score) query.min_score = params.min_score;
  if (params.search) query.search = params.search;
  return client.get('/api/talent-pool/', { params: query });
};
