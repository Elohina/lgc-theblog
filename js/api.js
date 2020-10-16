
import { API_URL } from '../constants.js';

const apiRequest = async(resource, method, headers, body) => {
  const result = await fetch(`${API_URL}${resource}`, {
    ...(method && {method: method}),
    ...(headers && {headers: headers}),
    ...(body && {body: body})
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    return data;
  })
  .catch(err => {
    console.log('Somenthing went wrong.', err);
  });
  return result;
};

export const fetchPosts = () => {
  return apiRequest('/posts');
};

export const fetchPost = postId => {
  return apiRequest(`/posts/${postId}`);
}

export const fetchComments = postId => {
  return apiRequest(`/posts/${postId}/comments`);
};

export const addComment = ({postId, content, user, date, parent_id}) => {
  return apiRequest(
    `/posts/${postId}/comments`, 
    'POST',
    {'Content-Type': 'application/json'},
    JSON.stringify({postId, content, user, date, parent_id})
  );
};