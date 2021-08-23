// 基础
export interface Meta {
  views: number;
  likes: number;
  comments: number;
}

export interface ToAuthor {
  author_id: string;
  name: string;
  avatar: string;
}
export interface Params {
  keyword?: string;
  pageSize: number;
  pageNumber: number;
  name: string; //后端的hql是 from Article a
  sort: string;
}

// 登录
export interface LoginParams {
  email: string;
  password: string;
}
export interface UserInfo {
  id: string;
  name: string;
  avatar: string | any;
  account: string;
}
export interface RegAndLogParams {
  email: string;
  name: string;
  password: string;
  phone: string;
  desc: string;
}


// 导航 nav
export interface NavListItem {
  index: string;
  path: string;
  name: string;
}



// 文章归档
export interface ParamsArchive {
  keyword: string;
  likes: string; // 是否是热门文章
  state: number; // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
  article: number;
  tag_id: string;
  category_id: string;
  pageNum: number;
  pageSize: number;
}
export interface ArchiveListItem {
  createDate: string;
  title: string;
  id: string;
}
export interface ArchiveList {
  year: string;
  list: ArchiveListItem[];
}
export interface ArchiveData {
  count: number;
  data: ArchiveList | any;
}


// 文章详情
export interface OtherComments {
  content: string;
  createDate: string;
  likes: number;
  state: number;
  to_author: ToAuthor;
  author: ToAuthor;
  id: string;
}
export interface Comments {
  article_id: string;
  content: string;
  createDate: string;
  id: number;
  is_handle: number;
  is_top: boolean;
  likes: number;
  other_comments: OtherComments[];
  state: number;
  updateTime: string;
  author: ToAuthor;
  author_id: string;
  __v: number;
}

export interface ArticleDetailIF {
  toc: string;
  author: object;
  comments: Array<Comments>;
  commentCounts: number,
  viewCounts: number,
  likes: number,
  createDate: string;
  summary: string;
  content: string;
  id: number;
  avatar: string;
  wordNum: number;
  keyword?: Array<string>;
  likeUsers: Array<any>;
  origin: number;
  state: number;
  tags: Array<any>;
  category: object,
  title: string;
  updateTime: string;
}

export interface ArticleDetailParams {
  id: string | string[];
  type: number;
}

export interface LikeParams {
  id: string;
  user_id: string;
}


export interface List {
  category: string[];
  createDate: string;
  desc: string;
  avatar: string;
  meta: Meta;
  tags: string[];
  title: string;
  id: string;
}
export interface ArticlesData {
  count: number;
  data: List | any;
}


// 留言
export interface MessageParams {
  email: string;
  phone: string;
  name: string;
  content: string;
}
export interface RulesItem {
  validator: Function;
  trigger: string;
}
export interface Rules {
  email: RulesItem[];
  phone: RulesItem[];
  name: RulesItem[];
  content: RulesItem[];
}


// 项目
export interface ProjectList {
  content: string;
  columnName: string,
  end_time?: string;
  cover: string;
  start_time: string;
  title: string;
  url?: string;
  id: string;
}
export interface ProjectsData {
  count: number;
  data: ProjectList | any;
}


// 历程
export interface TimelineList {
  content: string;
  end_time: string;
  start_time: string;
  title: string;
  state: number;
  id: Number;
}
export interface TimelinesData {
  count: number;
  list: TimelineList | any;
}


// 标签
export interface TagList {
  name: string;
  id: string;
}
export interface TagsData {
  count: number;
  data: TagList | any;
}
