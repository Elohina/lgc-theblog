
export const formatDate = date => {
  return new Date(date).toDateString();
};

export const sortPosts = (posts) => {
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
  return posts;
};