
import { API_URL } from '../constants.js';

/**
 * Calls API using fetch and data provided
 * @param {String} resource Path to the resource
 * @param {String} [method] REST method
 * @param {object} [headers] Headers
 * @param {String} [body] Body content
 * @returns {object} Promise with call result
 */
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

/**
 * Gets list of posts
 * @returns {object} Promise with call result
 */
export const fetchPosts = () => {
  return apiRequest('/posts');
};

/**
 * Gets information of a single post
 * @param {Number} postId Post ID
 * @returns {object} Promise with call result
 */
export const fetchPost = postId => {
  return apiRequest(`/posts/${postId}`);
};

/**
 * Get comments from a single post
 * @param {Number} postId Post ID
 * @returns {object} Promise with call result
 */
export const fetchComments = postId => {
  return apiRequest(`/posts/${postId}/comments`);
};

/**
 * Adds a new comment to a post 
 * @param {object} param0 New comment data
 * @returns {object} Promise with call result
 */
export const addComment = ({postId, content, user, date, parent_id}) => {
  return apiRequest(
    `/posts/${postId}/comments`, 
    'POST',
    {'Content-Type': 'application/json'},
    JSON.stringify({postId, content, user, date, parent_id})
  );
};