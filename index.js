
import { fetchPosts, fetchComments, addComment, fetchPost } from './js/api.js';

const formatDate = date => {
  return new Date(date).toDateString();
};

const createCommentElement = ({id, user, date, content, parent_id, postId}) => {
  let commentElement = document.createElement('div');
  commentElement.setAttribute("id", id);
  commentElement.classList.add("post-comments__item");
  commentElement.innerHTML = `
    <div id="response-${id}" class="w-100">
      <h5 class="mb-1">${user}</h5>
      <small>${formatDate(date)}</small>
      <p class="mb-2">${content}</p>
    </div>
    <form id="post-comments-form-${id}" data-parent=${id} class="post-comments__form" style="display:none;">
      <div class="form-group">
        <label for="user-name">Name</label>
        <input id="user-name" name="user-name" type="text" class="form-control" required/>
      </div>
      <div class="form-group">
        <label for="user-comment">Content</label>
        <textarea id="user-comment" class="form-control" rows="5" cols="50" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
      <button id="cancelButton${id}" type="button" class="btn btn-secondary">Cancel</button>
    </form>
  `;
  let replyButton = document.createElement('button');
  replyButton.addEventListener('click', event => {
    const replyForm = document.getElementById(`post-comments-form-${id}`);
    replyForm.style.display="block";
    replyButton.style.display="none";
    replyForm.addEventListener('submit', event => {
      event.preventDefault();
      const user = replyForm.querySelector("#user-name").value;
      const content = replyForm.querySelector("#user-comment").value;
      const parentId = replyForm.getAttribute('data-parent');
      const date = new Date();
      addComment({postId: parseInt(postId), content, date, parent_id: parseInt(parentId), user}).then(response => {
        replyForm.reset();
        replyForm.style.display="none";
        commentElement.appendChild(createCommentElement(response));
      });
    });
  });
  replyButton.textContent ="Reply";
  replyButton.classList.add("btn", "btn-light");
  commentElement.querySelector(`#cancelButton${id}`).addEventListener('click', event => {
    const replyForm = document.getElementById(`post-comments-form-${id}`);
    replyButton.style.display = "block";
    replyForm.style.display = "none";
  });
  commentElement.appendChild(replyButton);
  return commentElement;
};

const renderComments = (comments) => {
  let postComments = document.getElementById('post-comments');
  if (comments.length) {
    comments.forEach(comment => {
      let commentElement = createCommentElement(comment);
      if (comment.parent_id) {
        commentElement.classList.add("post-comments__response");
        postComments.querySelector(`#response-${comment.parent_id}`).append(commentElement);  
      } else {
        postComments.appendChild(commentElement);
      }
      
    });
  } else {
    postComments.innerHTML = "<p>Be the first to comment this post!</p>";
  }
};

const openPost = (post) => {
  document.querySelector('#post-title').textContent = post.title;
  document.querySelector('#post-description').textContent = post.description;
  document.querySelector('#post-content').innerHTML = post.content;
  document.querySelector('#post-author').textContent = post.author;

  
  fetchComments(post.id).then(comments => {
    renderComments(comments);
  });

};

const renderPosts = (posts) => {
  posts.sort((a, b) => {
    let dateA = new Date(a.publish_date);
    let dateB = new Date(b.publish_date);
    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return 1;
    }
    return 0;
  });
  let postsContainer = document.querySelector("#postsList");
  const featured = posts[0];
  document.getElementById("featuredAuthor").textContent = featured.author ;
  document.getElementById("featuredTitle").textContent = featured.title ;
  document.getElementById("featuredDate").textContent = formatDate(featured.publish_date);
  document.getElementById("featuredDescription").textContent = featured.description ;
  document.getElementById("featuredHref").setAttribute("href", `/post.html?id=${JSON.stringify(featured.id)}`); 

  posts.forEach(post => {
    let cell = document.createElement('a');
    cell.classList.add("posts__item", "list-group-item", "list-group-item-action", "flex-column", "align-items-start");
    cell.setAttribute("id", post.slug);
    cell.setAttribute("href", `/post.html?id=${JSON.stringify(post.id)}`);
    cell.innerHTML = `
      <small>${post.author}</small>
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${post.title}</h5>
        <small>${formatDate(post.publish_date)}</small>
      </div>
      <p class="mb-1">${post.description}</p>`;
    cell.addEventListener("click", event => openPost(post));
    postsContainer.appendChild(cell);
  });
};

window.addEventListener('load', () => {
  var app = document.querySelector('[data-app]');
  var page = app.getAttribute('data-app');


  if (page === 'home') {
    fetchPosts().then(posts => {
      if (posts.length) {
        renderPosts(posts);
      } else {
        document.querySelector("#postsList").innerHTML = "<p>There are no posts published yet. Come back later :)</p>";
      }
    });
  }

  if (page === 'post') {
    const href = window.location.href;
    const postId = parseInt(href.slice(href.indexOf("=")+1));
    fetchPost(postId).then(post => {
      openPost(post);
    });
    let commentsForm = document.getElementById('post-comments-form');
    commentsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = commentsForm.querySelector("#user-name").value;
      const content = commentsForm.querySelector("#user-comment").value;
      const date = new Date();
      addComment({postId, content, date, parent_id: null, user}).then(response => {
        commentsForm.reset();
        document.getElementById('post-comments').appendChild(createCommentElement(response));
      });
    });
  }
});


