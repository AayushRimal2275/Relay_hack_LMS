import client from '../../../api/client';

const api = {
  get: (url, config) => client.get(url, config),
  post: (url, data) => client.post(url, data),
  patch: (url, data) => client.patch(url, data),
  delete: (url) => client.delete(url),
};

export default api;
