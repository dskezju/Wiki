// import Mock from "mockjs";
// import URLs from "./urls.js";

// const DEBUG = true; // debug 总开关
// /**
//  * debug: false | true,
//  * data: {}
//  */
// const mockData: object = {
//   getLineList: {
//     debug: true,
//     data: {
//       status: "100",
//       message: "操作成功",
//       data: {
//         count: "@natural(10, 100)",
//         "list|7-10": [
//           {
//             date: '@date("MMdd")',
//             ringRatio: "@natural(10, 50)",
//             rate: "@natural(-10, 50)",
//             name: "@city",
//             rank: "@natural(1, 50)",
//             value: "@natural(1, 100)"
//           }
//         ]
//       }
//     }
//   },
//   getClassroomInformList: {
//     debug: true,
//     data: {
//       status: "100",
//       message: "操作成功",
//       data: {
//         count: "@natural(10, 100000)",
//         "list|1-10": [
//           {
//             id: "@natural(10, 100000)",
//             classroom_id: "@natural(10, 100000)",
//             student_id: "@natural(10, 100000)",
//             student_name: "@string",
//             user_name: "@string",
//             student_url: "//www.baidu.com/img/bd_logo1.png",
//             head_portrait: "//www.baidu.com/img/bd_logo1.png",
//             assignment_type: "@natural(1, 2)",
//             own: "@natural(10, 100000)",
//             article: "@string",
//             score: "@natural(10, 100000)",
//             integral: "@natural(10, 100000)",
//             time: "@natural(10, 100000)",
//             task_time: "@natural(10, 100000)",
//             "comment|1-10": [
//               {
//                 id: "@natural(10, 100000)",
//                 name: "@string",
//                 comment: "@string"
//               }
//             ],
//             "seal|1-10": [
//               {
//                 id: "@natural(10, 100000)",
//                 user_id: "@natural(10, 100000)",
//                 name: "@string",
//                 colour: "@string",
//                 style: "@string"
//               }
//             ]
//           }
//         ]
//       }
//     }
//   }
// };

// Mock.setup({
//   timeout: 500
// });

// const mockTest: Function = function(urls: object) {
//   if (!DEBUG) {
//     return false;
//   }
//   for (const key in mockData) {
//     if (mockData[key].debug === true && urls[key] !== undefined) {
//       Mock.mock(urls[key], mockData[key].data);
//       // console.log('urls[key]',urls[key])
//     }
//   }
// };

// mockTest(URLs);



import request from '@/request'


export function getArticles(query, page) {

  // return new Promise((resolve) => {
  //   let res = {
  //     data: [
  //       {
  //         id: 1,
  //         weight: 10,
  //         title: '测试',
  //         commentCounts: 0,
  //         public: true,
  //         viewCounts: 10,
  //         summary: '这是一篇测试',
  //         author: {
  //           name: 'avalon',
  //         },
  //         tags: [{tagName:'markdown'}, {tagName:'vue'}, {tagName:'文章'}],
  //         createDate: '2021-1-2',
  //         year: 2019,
  //       }
  //     ]
  //   }
  //   resolve(res)
  // })
  return request({
    url: '/articles',
    method: 'get',
    params: {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      name: page.name,
      sort: page.sort,
      year: query.year,
      month: query.month,
      tagId: query.tagId,
      categoryId: query.categoryId
    }
  })
}

export function getHotArtices() {
  return request({
    url: '/articles/hot',
    method: 'get'
  })
}

export function getNewArtices() {
  return request({
    url: '/articles/new',
    method: 'get'
  })
}

export function viewArticle(id) {
  // return new Promise(resolve => {
  //   let data = {
  //     data: {
  //       id: 1,
  //       title: '测试',
  //       commentCounts: 0,
  //       viewCounts: 10,
  //       summary: '这是一篇测试',
  //       author: {id:1, name: 'avalon'},
  //       tags: [{id:1, tagName:'markdown'}, {id:2, tagName:'vue'}, {id: 3, tagName:'文章'}],
  //       category:{id:1, categoryname: '前端测试'},
  //       createDate: '2020.1.2',
  //       body: {
  //         content: 'Markdown 语法简介',
  //         contentHtml: ''
  //       }
  //     }
  //   }
  //   resolve(data)
  // })
  console.log('view id:', id)
  return request({
    url: `/articles/view/${id}`,
    method: 'get'
  })
}

export function getArticlesByCategory(id) {
  return request({
    url: `/articles/category/${id}`,
    method: 'get'
  })
}

export function getArticlesByTag(id) {
  return request({
    url: `/articles/tag/${id}`,
    method: 'get'
  })
}

export function getArticlesByColumn(id){
  return request({
    url: `/articles/column/${id}`,
    method: 'get',
  })
}


export function publishArticle(article) {
  return request({
    url: '/articles/publish',
    method: 'post',
    data: article
  })
}

export function listArchives() {
  return request({
    url: '/articles/listArchives',
    method: 'get'
  })
}

export function getArticleById(id) {

  // return new Promise(resolve => {
  //   let data = {
  //     data: {
  //       id: 1,
  //       title: '测试',
  //       commentCounts: 0,
  //       viewCounts: 10,
  //       summary: '这是一篇测试',
  //       author: {name: 'avalon'},
  //       tags: [{id:1, tagName:'markdown'}, {id:2, tagName:'vue'}, {id: 3, tagName:'文章'}],
  //       category:{id:1, categoryname: '前端测试'},
  //       createDate: '2020.1.2',
  //       body: {
  //         content: ''
  //       }
  //     }
  //   }
  //   resolve(data)
  // })
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

export function updateArticleLikes(id, user){
  return request({
    url: `/articles/updateLikes`,
    method: 'post',
    data: {
      articleId: id,
      likeUser: user,
    }
  })
}

export function getArticlesByAuthor(id){
  return request({
    url: `articles/author/${id}`,
    method: 'get',
  })
}
