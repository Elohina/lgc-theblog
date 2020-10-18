/**
 * Format a date into a user friendly form
 * @param {String} date Date to be formatted
 * @returns {String} Formatted date
 */
export const formatDate = date => {
  return new Date(date).toDateString();
};

/**
 * Sort the posts' list by publish date
 * @param {object[]} posts Posts list
 * @returns {object[]} Sorted list
 */
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