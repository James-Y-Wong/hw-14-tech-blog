const newPostHandler = async (evt) => {
  evt.preventDefault();
  const title = document.querySelector('#create-post-title').value;
  const content = document.querySelector('#create-post-content').value;

  await fetch('/api/post', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  document.location.replace('/dashboard');
};

const editBlogHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#blogTitle').value.trim();
  const content = document.querySelector('#blogContent').value.trim();

  if (title && content) {
    const response = await fetch('/api/post/edit-blog', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      //?double check the redirect
      document.location.replace('/dashboard');
    } else {
      alert('Failed to edit a blog');
    }
  }
};

const delButtonHandler = async (evt) => {
  if (evt.target.hasAttribute('data-id')) {
    const id = evt.target.getAttribute('data-id');

    const response = await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('#create-post-form')
  .addEventListener('submit', newPostHandler);
document
  .querySelector('.edit-blog-form')
  .addEventListener('submit', editBlogHandler);
document
  .querySelector('#delete-post')
  .addEventListener('submit', delButtonHandler);
