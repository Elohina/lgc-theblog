import { formatDate, sortPosts } from './utils.js';
import { fetchComments, addComment } from './api.js';

export const createCommentElement = ({id, user, date, content, postId}) => {
  let commentElement = document.createElement('div');
  let replyButton = document.createElement('button');

  commentElement.setAttribute("id", id);
  commentElement.classList.add("post-comments__item");
  commentElement.innerHTML = `
    <div id="response-${id}">
      <h5>${user}</h5>
      <small class="post-comments__item__date">${formatDate(date)}</small>
      <p class="post-comments__item__content">${content}</p>
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
  replyButton.classList.add("btn", "btn-light", "mt-2");
  commentElement.querySelector(`#cancelButton${id}`).addEventListener('click', event => {
    const replyForm = document.getElementById(`post-comments-form-${id}`);
    replyButton.style.display = "block";
    replyForm.style.display = "none";
  });
  commentElement.appendChild(replyButton);
  
  return commentElement;
};

export const renderComments = (comments) => {
  let postComments = document.getElementById('post-comments');
  document.getElementById('comments-amount').textContent = comments.length;
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

export const openPost = (post) => {
  document.querySelector('#post-title').textContent = post.title;
  document.querySelector('#post-description').textContent = post.description;
  document.querySelector('#post-content').innerHTML = post.content;
  document.querySelector('#post-author').textContent = post.author;

  fetchComments(post.id).then(comments => {
    renderComments(comments);
  });

};

export const renderPosts = (posts) => {
  const sortedPosts = sortPosts(posts);
  let postsContainer = document.querySelector("#postsList");
  const featured = sortedPosts[0];
  document.getElementById("featuredAuthor").textContent = featured.author ;
  document.getElementById("featuredTitle").textContent = featured.title ;
  document.getElementById("featuredDate").textContent = formatDate(featured.publish_date);
  document.getElementById("featuredDescription").textContent = featured.description ;
  document.getElementById("featuredHref").setAttribute("href", `/post.html?id=${JSON.stringify(featured.id)}`); 

  sortedPosts.forEach(post => {
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