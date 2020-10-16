
const api = "http://localhost:9001";

export const fetchPosts = async() => {
  const result = await fetch(`${api}/posts`).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    console.log(data)
    return data;
  })
  .catch(err => {
    console.log('Somenthing went wrong.', err);
  });

  return result;
};

export const fetchPost = async(id) => {
  const result = await fetch(`${api}/posts/${id}`).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    console.log(data)
    return data;
  })
  .catch(err => {
    console.log('Somenthing went wrong.', err);
  });

  return result;
}

export const fetchComments = async(id) => {
  const result = await fetch(`${api}/posts/${id}/comments`).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    console.log(data)
    return data;
  })
  .catch(err => {
    console.log('Somenthing went wrong.', err);
  });

  return result;
};

export const addComment = async({postId, content, user, date, parent_id}) => {
  const result = await fetch(`${api}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({postId, content, user, date, parent_id}),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    console.log(data)
    return data;
  })
  .catch(err => {
    console.log('Somenthing went wrong.', err);
  });

  return result;
};