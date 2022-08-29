
class Data {
  constructor() {
    this.url = 'https://gorest.co.in/public-api/posts';
    this.urlComments = 'https://gorest.co.in/public-api/comments';
    this.postFile = 'post.html';
    this.indexFile = 'index.html';
  };
  
  get getUrl() {
    return this.url;
  };

  get getUrlComments() {
    return this.urlComments;
  };

  get getPostFile() {
    return this.postFile;
  };
  get getIndexFile() {
    return this.indexFile;
  };

};

class ListArticlesController {

  constructor(container, url, postFile, indexFile) {
    this.url = url;
    this.postFile = postFile;
    this.indexFile = indexFile
    this.container = container;
  };

  async createListArticles() {
    await this.getListArticles();

    const articles = new ListArticles(this.container);
    const pagination = new Pagination(this.container, this.page, this.total)

    articles.createArticlesListContainer();
    this.createСatalog(articles);

    pagination.createPagination();
    pagination.createPaginationPages();

    this.addLinksArticles();
    this.addLinksPagination();
  };

  async getListArticles() {
    const urlInitial = new CreateUrl()
    urlInitial.setUrl = this.url;
    const urlPost = urlInitial.createUrl();
    const responsePost = new GetResponse(urlPost);
    const properties = await responsePost.getProperties();
    this.data = properties.data;
    this.page = properties.meta.pagination.page;
    this.total = properties.meta.pagination.pages;
  };

  addLinksArticles() {
    document.querySelectorAll('.article-link').forEach((el, index) => {
      el.href = this.createLink('id', this.data[index].id, this.postFile);
    });
  };

  addLinksPagination() {
    document.querySelectorAll('.page-number-link').forEach((el) => {
      if (el.textContent !== '<-назад') {
        el.href = this.createLink('page', el.textContent, 'index.html');

      } else {
        el.href = this.createLink('page', 1, 'index.html');
      };
    });

    if (this.page !== 1) {
      document.querySelector('.page-previous').href = this.createLink('page', this.page - 1, 'index.html')
    } else {
      document.querySelector('.page-previous').href = this.createLink('page', this.page, 'index.html');
    };

    if (this.page !== this.total) {
      document.querySelector('.page-next').href = this.createLink('page', this.page + 1, 'index.html')
    } else {
      document.querySelector('.page-next').href = this.createLink('page', this.page, 'index.html');
    };
  };

  createLink(key, value, file) {
    const search = new URLSearchParams(window.location.search);
    if (search.has('page')) {
      search.delete('page')
    }
    search.append(`${key}`, value);
    const link = file + '?' + search.toString();
    return link;
  };

  createСatalog(articles) {
    for (const el of this.data) {
      articles.setTitle = el.title;
      articles.createСatalogArticles();
    };
  };
};


class ListArticles {
  constructor(container, title) {
    this.template = new Template();
    this.container = container;
  };

  /**
   * @param {any} value
   */
  set setTitle(value) {
    this.title = value;
  };


  createArticlesListContainer() {
    const addCatalogArticles = this.createCatalogArticlesList();
    this.container.append(addCatalogArticles);
  };

  createCatalogArticlesList() {
    const catalogArticlesListTemplate = `
        <ul class = "articles list-group list-group-item-action"></ul>
     `;


    this.template.setTemplate = catalogArticlesListTemplate;
    const catalogArticlesListInitial = this.template.createFromTemplate();
    return catalogArticlesListInitial;
  };

  createСatalogArticles() {
    const article = new ArticleItem(this.title);
    const catalogArticlesItem = article.createCatalogArticlesItem();
    document.querySelector('.articles').append(catalogArticlesItem);

  };

  createCatalogArticlesItem(title) {
    const catalogArticlesItemTemplate = `
        <li class="article-item list-group-item list-group-item-action">
        <a class='article-link' target="_self" href=''>
         ${title}
        </a>
        </li>
        `;
    this.template.setTemplate = catalogArticlesItemTemplate;
    const catalogArticlesItemInicial = this.template.createFromTemplate();
    return catalogArticlesItemInicial;
  };
};

class Pagination {
  constructor(container, page, total) {
    this.container = container;
    this.page = page;
    this.total = total;
    this.template = new Template();
  };

  createPagination() {
    const addPagination = this.createPaginationContainer();
    this.container.append(addPagination);
  };

  createPaginationContainer() {
    const paginationTemplate = `
       <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
         <li class="page-item">
          <a class="page-link page-previous" target="_self" href="" aria-label="Previous">
           <span aria-hidden="true">&laquo;</span>
          </a>
         </li>
         <div class="pagination-list" style="display: flex">
         </div>
         <li class="page-item">
          <a class="page-link page-next"  target="_self" href="" aria-label="Next">
           <span aria-hidden="true">&raquo;</span>
          </a>
         </li>
        </ul>
       </nav>
  `;

    this.template.setTemplate = paginationTemplate;
    const paginationInitial = this.template.createFromTemplate();
    return paginationInitial;
  };

  createPaginationPages() {
    for (let i = this.page; i < this.page + 10; i++) {
      if (i === this.total + 1) {
        break;
      };
      const addPaginationItem = this.createPaginationItem(i);
      document.querySelector('.pagination-list').append(addPaginationItem);

      if (this.page === this.total) {
        const addPaginationItem = this.createPaginationItem('<-назад');
        document.querySelector('.pagination-list').append(addPaginationItem);
      };
    };

    this.createPageActive();
  };

  createPageActive() {
    document.querySelector('.page-number').classList.add('active');
  };


  createPaginationItem(number) {
    const paginationItemTemplate = `
        <li class="page-item page-number"><a class="page-link page-number-link" target="_self" href="">${number}</a></li>
    `;
    this.template.setTemplate = paginationItemTemplate;
    const paginationItemInitial = this.template.createFromTemplate();
    return paginationItemInitial;
  };
};

class Template {
  constructor() {
    this.template = null;
  };

  get templateProperties() {
    return this.template;
  };

  /**
   * @param {(arg0: string) => void} value
   */
  set setTemplate(value) {
    this.template = value;
  };

  createFromTemplate() {
    const element = document.createElement('template');
    element.innerHTML = this.template.trim();
    return element.content.firstChild;
  };
};


class GetResponse {
  constructor(url) {
    this.url = url;
  };

  async getProperties() {

    const response = await fetch(this.url);
    const responseResult = await response.json();
    return responseResult;
  };
};

class ArticleItem {
  constructor(title) {
    this.template = new Template()
    this.title = title;
  };

  createCatalogArticlesItem() {
    const catalogArticlesItemTemplate = `
      <li class="article-item list-group-item list-group-item-action">
      <a class='article-link' href=''>
       ${this.title}
      </a>
      </li>
      `;
    this.template.setTemplate = catalogArticlesItemTemplate;
    const catalogArticlesItemInicial = this.template.createFromTemplate();
    return catalogArticlesItemInicial;
  };
};

class PostController {
  constructor(container, url, urlComments) {
    this.container = container;
    this.url = url;
    this.urlComments = urlComments;
  };

  async createPost() {
    await this.getPost();
    await this.getComments();
    this.createUrlHome();
    const article = new Post(this.container);
    article.setTitle = this.data.title;
    article.setBody = this.data.body;
    article.addPostContainer();
    const comments = new Comments(this.container, this.dataComments)
    comments.addCommentsList();
  };

  async getPost() {
    const urlInitial = new CreateUrl()
    urlInitial.setUrl = this.url;
    const urlPost = urlInitial.createUrl();
    const responsePost = new GetResponse(urlPost);
    const propertiesPost = await responsePost.getProperties();
    this.data = propertiesPost.data[0];
  };

  async getComments() {
    const urlCommentsPost = this.createUrlCommentsPost();
    const responseComments = new GetResponse(urlCommentsPost);
    const propertiesComments = await responseComments.getProperties();
    this.dataComments = propertiesComments.data;
  };

  createUrlCommentsPost() {
    const locationSearch = new URLSearchParams(window.location.search);
    const url = new URL(this.urlComments);
    const value = locationSearch.values().next().value;
    url.searchParams.append('post__id', value)
    return url.toString();
  };

  createUrlHome() {
    const search = new URLSearchParams(window.location.search)
    search.delete('id');
    const link = this.file + '?' + search.toString();
    return link;
  };
};


class Post {
  constructor(container) {
    this.container = container;
    this.template = new Template();
  };

  /**
   * @param {any} value
   */
  set setTitle(value) {
    this.title = value;
  };

  /**
   * @param {any} value
   */
  set setBody(value) {
    this.body = value;
  };

  createArticleTitle() {
    const postTitleTemplate = `
    <h class="fw-bold">${this.title}</h>;
    `;
    this.template.setTemplate = postTitleTemplate;
    const postTitleInitial = this.template.createFromTemplate();
    return postTitleInitial;
  };

  createArticleBody() {
    const postBodyTemplate = `
    <p>${this.body}</p>;
    `;
    this.template.setTemplate = postBodyTemplate;
    const postBodyInitial = this.template.createFromTemplate();
    return postBodyInitial;
  };

  addPostContainer() {
    const addTitlePost = this.createArticleTitle();
    const addBodyPost = this.createArticleBody();
    this.container.append(addTitlePost);
    this.container.append(addBodyPost);
  };
};

class Comments {
  constructor(container, comments) {
    this.container = container;
    this.comments = comments;
    this.template = new Template();
  };

  createCommentsList() {
    const commentsContainerTemplate = `
  <ul class="comments-container list-group list-group-flush"></ul>
  `;
    this.template.setTemplate = commentsContainerTemplate;
    const commentsContainerInitial = this.template.createFromTemplate();
    return commentsContainerInitial;
  };

  addCommentsList() {
    const commentsList = this.createCommentsList();
    this.container.append(commentsList);
    this.createComments();
  };

  createCommentsItem(comment) {
    const commentsItemTemplate = `
      <li class="comments-Item list-group-item">
       <p class="comments-name fw-bold">${comment.name}</p>
       <p class="comments-text">${comment.body}</p>
      </li>
  `;
    this.template.setTemplate = commentsItemTemplate;
    const commentsItemInitial = this.template.createFromTemplate();
    return commentsItemInitial;
  };

  addCommentsItem(comment) {
    const commentsItem = this.createCommentsItem(comment);
    document.querySelector('.comments-container').append(commentsItem);
  };

  createComments() {
    this.comments.forEach((comment) => {
      this.addCommentsItem(comment);
    });
  };

};

class CreateUrl {
  constructor() {
    this.url = null;
  };

  /**
   * @param {any} value
   */
  set setUrl(value) {
    this.url = value;
  };

  createUrl() {
    const locationSearch = new URLSearchParams(window.location.search)
    const key = locationSearch.keys().next().value;
    const value = locationSearch.values().next().value;
    const urlPost = new URL(this.url);
    urlPost.searchParams.append(`${key}`, value);
    return urlPost.toString();
  };
};





