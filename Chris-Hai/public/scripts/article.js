'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

Article.fetchAll = () => {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    articleView.initIndexPage();
  } else {
    $.getJSON('/data/hackerIpsum.json')
      .then(data => {
        Article.loadAll(data);
        localStorage.rawData = JSON.stringify(data);
        articleView.initIndexPage();
      }, err => {
        console.error(err);
      });
  }
}

// REVIEW: This new prototype method on the Article object constructor will allow us to create a new article from the new.html form page, and submit that data to the back-end. We will see this log out to the server in our terminal!
Article.prototype.insertRecord = function(callback){
  $.post('/articles', {title: this.title, category: this.category, author: this.author, authorUrl: this.authorUrl, publishedOn: this.publishedOn, body: this.body })
    .then(data => {
      console.log(data);
      let oldArticle = JSON.parse(localStorage.getItem('rawData')) || [];
      oldArticle.push(data);
      localStorage.setItem('rawData', JSON.stringify(oldArticle));
      // COMMENT: What is the purpose of this line? Is the callback invoked when this method is called? Why or why not?
      // When the function is called when creating a new blog article it is called without a parameter. The callback parameter is not invoked when this method is called because a parameter is not being included when it was called in articleView.
      if (callback) callback();
    })
};
