
import { fetchPosts, addComment, fetchPost } from './api.js';
import { createCommentElement, openPost, renderPosts } from './blog.js';

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


