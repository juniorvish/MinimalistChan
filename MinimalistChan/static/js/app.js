async function fetchPosts() {
  const response = await fetch('/posts');
  const posts = await response.json();
  renderPosts(posts);
}

async function submitPost(event) {
  event.preventDefault();
  const postInput = document.getElementById('postInput');
  const content = postInput.value.trim();

  if (content) {
    const response = await fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      postInput.value = '';
      fetchPosts();
    }
  }
}

async function submitReply(event, postId) {
  event.preventDefault();
  const replyInput = document.getElementById(`replyInput-${postId}`);
  const content = replyInput.value.trim();

  if (content) {
    const response = await fetch(`/posts/${postId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      replyInput.value = '';
      fetchPosts();
    }
  }
}

function renderPosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.innerHTML = `
      <div class="post">
        <div class="post-content">${post.content}</div>
        <div class="post-timestamp">${new Date(post.timestamp).toLocaleString()}</div>
        <form id="replyForm-${post.id}" onsubmit="submitReply(event, ${post.id})">
          <input id="replyInput-${post.id}" type="text" placeholder="Reply..." />
          <button type="submit">Reply</button>
        </form>
        <div class="replies">
          ${renderReplies(post.replies)}
        </div>
      </div>
    `;
    postContainer.appendChild(postElement);
  });
}

function renderReplies(replies) {
  return replies.map(reply => `
    <div class="reply">
      <div class="reply-content">${reply.content}</div>
      <div class="reply-timestamp">${new Date(reply.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}

document.getElementById('postForm').addEventListener('submit', submitPost);
fetchPosts();