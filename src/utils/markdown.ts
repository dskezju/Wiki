// https://www.cherylgood.cn/detail/5bdaf4722382b4646c27143b.html
import highlight from 'highlight.js'
import marked from 'marked'
// const highlight = require("highlight.js");
// const marked = require("marked");

function click(e) {
  console.log('e:', e)
}


const tocObj = {
  add: function (text: any, level: any) {
    var anchor = `#toc${level}${++this.index}`; //第二级标签，是所有标签里第五个，就是 #toc25
    this.toc.push({ anchor: anchor, level: level, text: text });
    return anchor;
  },
  // 使用堆栈的方式处理嵌套的ul,li，level即ul的嵌套层次，1是最外层
  // <ul>
  //   <li></li>
  //   <ul>
  //     <li></li>
  //   </ul>
  //   <li></li>
  // </ul>
  toHTML: function () {
    let levelStack: any = [];
    let result = "";
    const addStartUL = () => {
      result += '<ul class="anchor-ul" id="anchor-fix">';
    };
    const addEndUL = () => {
      result += "</ul>\n";
    };
    const addLI = (anchor: any, text: any) => {
      result += //href = #element，就是到对应的id的元素上去
        '<li><a class="toc-link" href="#' + anchor + '">' + text + "</a></li>\n";
    };

    //遍历toc里所有item，创建目录，bug是如果最开始是低级标题，后面是高级标题就会出错
    this.toc.forEach(function (item: any) {
      let levelIndex = levelStack.indexOf(item.level);
      // 没有找到相应level的ul标签，则将li放入新增的ul中
      if (levelIndex === -1) {
        levelStack.unshift(item.level); //插入到levelStack的头部
        addStartUL(); //添加<ul>和<li/>
        addLI(item.anchor, item.text);
      }
      // 找到了相应level的ul标签，并且在最左边的位置则直接将li放在此ul下
      else if (levelIndex === 0) {
        addLI(item.anchor, item.text);
      }
      // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上</ul>，最后新增li
      //比如先碰到了一级和二级标签，然后又碰到一级标签，那就出栈到一级标签为止
      //边出栈边加</ul>，因为更低级的标签结束了
      else {
        while (levelIndex--) { //如果levelIndex是1，那就只删一个元素
          levelStack.shift(); //删除第一个元素
          addEndUL(); //并添加</ul>
        }
        addLI(item.anchor, item.text);
      }
    });
    // 如果栈中还有level，全部出栈打上闭合标签
    while (levelStack.length) {
      levelStack.shift();
      addEndUL();
    }
    // 清理先前数据供下次使用
    this.toc = [];
    this.index = 0;
    return result;
  },
  toc: [] as any,
  index: 0
};

class MarkUtils {
  private rendererMD: any;

  constructor() {
    this.rendererMD = new marked.Renderer() as any;
    //在每个标题上都添加id为anchor
    this.rendererMD.heading = function (text: any, level: any, raw: any) {
      var anchor = tocObj.add(text, level);
      return `<h${level} id=${anchor}>${text}</h${level}>\n`;
    };
    this.rendererMD.table = function (header: any, body: any) {
      return '<table class="table" border="0" cellspacing="0" cellpadding="0">' + header + body + '</table>'
    }
    highlight.configure({ useBR: true });
    marked.setOptions({
      renderer: this.rendererMD,
      headerIds: false,
      gfm: true,
      // tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code: any) {
        return highlight.highlightAuto(code).value;
      }
    });
  }

  //async，返回一个promise，外部需要用marked.then((res)=>{})取到这里的返回值
  async marked(data: any) {
    if (data) {
      let content = await marked(data);
      let toc = tocObj.toHTML();
      return { content: content, toc: toc };
    } else {
      return null;
    }
  }
}

const markdown: any = new MarkUtils();

export default markdown;
