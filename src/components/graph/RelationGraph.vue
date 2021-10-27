<template>
  <div style="margin-top:20px;width: 100%;height:100%;">
    <div style="height:110px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;color: #555555;font-size: 12px;">
      <div style="">
        <div style="line-height: 20px;">节点筛选：</div>
        <el-radio-group v-model="checked_sex" size="mini" @change="doFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="男"></el-radio-button>
          <el-radio-button label="女"></el-radio-button>
        </el-radio-group>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-radio-group v-model="checked_node_type" size="mini" style="margin-left:50px;" @change="doFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for='(label, i) in node_labels' :key="i" :label="label">{{label}}</el-radio-button>
        </el-radio-group>
      </div>

      <div>
        <div style="line-height: 20px;">关系筛选：</div>
        <el-checkbox-group v-model="rel_checkList" @change="doFilter">
          <el-checkbox v-for="thisItem in all_rel_type" :key="thisItem" :label="thisItem" />
        </el-checkbox-group>
      </div>
    </div>

    <div ref="myPage" style="height:calc(100vh - 50px);" @click="close">
      <seeks-relation-graph
        ref='seeksRelationGraph'
        :options='graphOptions'
        :on-node-click='onNodeClick'
        :on-line-click='onLineClick'
      >
        <!-- vue3里废弃了slot和slot-scope，变成v-slot:slot_name='slot-scope' -->
        <!-- v-slot:缩写为#，具名slot，slot-scope表示接收slot里提供的对象，contextmenu.prevent.stop表示右键 -->
        <template #node="{node}">
          <div
            class='slot-node'
            @contextmenu.prevent.stop="showNodeMenus(node, $event)"
            @mouseover="showNodeTips(node, $event)"
            @mouseout="hideNodeTips(node, $event)"
          >
            <div v-if='node.data.label=="image"'>
              <el-image style='width:60px;height:50px' :src='node.data.url' fit="cover" :preview-src-list="[node.data.url]"/>
            </div>
            <span v-else style="font-size: 14px;">
              {{ node.data.text }}
            </span>
          </div>
        </template>

        <!-- <template #bottomPanel style="border-top:#efefef solid 1px;height:60px;line-height: 60px;text-align: center;font-size: 18px;background-color: #ffffff;">
          这里是底部插槽 slot="bottomPanel",可以自定义这里的内容
        </template> -->
      </seeks-relation-graph>
    </div>
    <!-- 右键菜单 -->
    <div v-if="isShowNodeMenuPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行操作：</div>
      <div class="c-node-menu-item" @click.stop="focus()">focus</div>
      <div class="c-node-menu-item" @click.stop="doAction('操作2')">操作2</div>
      <div class="c-node-menu-item" @click.stop="doAction('操作3')">操作3</div>
      <div class="c-node-menu-item" @click.stop="doAction('操作4')">操作4</div>
    </div>
    <!-- 悬浮tips，不知道为什么这个tips一直在闪-->
    <div v-if="isShowNodeTipsPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">节点类型：{{currentNode.data.label}}</div>
      <div class="c-node-menu-item"
        v-for='(key, i) in Object.keys(currentNode.data)' :key="i">
        {{key}}:{{currentNode.data[key]}}
      </div>
      <div class="c-node-menu-item">label:{{currentNode.data.label}}</div>
    </div>
  </div>
</template>

<script>
import SeeksRelationGraph from '@/components/SeeksRelationGraph-Vue3'
import {getNodeEdgeTypes} from '@/api/graph'

export default {
  name: 'RelationGraph',
  components: {
    SeeksRelationGraph,
  },
  props: {
    graph: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      node_labels: [],
      checked_sex: '',
      checked_node_type: '',
      rel_checkList: [],
      all_rel_type: [],

      isShowNodeMenuPanel: false,
      isShowNodeTipsPanel: false,
      allowShowTipsPanel: false, //是否允许显示tips，不然只要悬浮它就会显示
      nodeMenuPanelPosition: { x: 0, y: 0 },

      graphOptions: {
        // defaultNodeColor: 'rgba(238, 178, 94, 1)',
        // allowShowMiniToolBar: true, //显示工具栏
        allowSwitchLineShape: true, //是否在工具栏中显示切换线条形状的按钮
        allowSwitchJunctionPoint: true, //是否在工具栏中显示切换连接点位置的按钮
        // disableZoom: false, //是否禁用通过鼠标滚轮进行缩放的功能
        // disableDragNode: false, //是否禁用图谱中节点的拖动
        // moveToCenterWhenResize: true, //当图谱的大小发生变化时，是否重新让图谱的内容看起来居中
        // allowShowZoomMenu: true, //是否在右侧菜单栏显示放大缩小的按钮，此设置和disableZoom不冲突
        // isMoveByParentNode: true, //是否在拖动节点后让子节点跟随
        // hideNodeContentByZoom: false, //是否根据缩放比例隐藏节点内容
        // defaultNodeShape: 0, //默认的节点形状，0:圆形；1:矩形
        // defaultNodeFontColor: 'white', //默认的节点文字颜色
        // defaultNodeBorderColor: '#33333', //默认的节点边框颜色
        defaultNodeBorderWidth: 4, //默认的节点边框粗细（像素）
        defaultNodeWidth: 40, //默认的节点宽度
        defaultNodeHeight: 40, //高度
        defaultJunctionPoint: 'border', //默认的连线与节点接触的方式（border:边缘/ltrb:上下左右/tb:上下/lr:左右）
        // defaultExpandHolderPosition: 'right', //默认的节点展开/关闭按钮位置（left/top/right/bottom）
        // defaultLineColor: 'blue', //默认的线条颜色
        // defaultLineWidth: 2, //默认的线条粗细（像素）
        // defaultLineShape: 1, //默认的线条样式（1:直线/2:样式2/3:样式3/4:折线/5:样式5/6:样式6）
        // defaultLineMarker: { //默认的线条箭头样式，示例参考：配置工具中的选项：连线箭头样式
        //   "markerWidth": "30",
        //   "markerHeight": 12,
        //   "refX": 6,
        //   "refY": 6,
        //   "data": "M2,2 L10,6 L2,10 L6,6 L2,2"
        // },
        // defaultShowLineLabel: true, //默认是否显示连线文字
        layouts: [
          {
            'label': '自动',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force',
          },
          {
            'label': '中心',
            'layoutName': 'center',
            'layoutClassName': 'seeks-layout-center'
          },
          { //切换回其它布局时原来的布局属性还会留着
            'label': '布局1', //布局描述（如果有多个布局可以切换，此属性将作为布局名称显示）
            'layoutName': 'center', //布局方式（tree树状布局/center中心布局/force自动布局）
            'layoutClassName': 'seeks-layout-center', //当使用这个布局时，会将此样式添加到图谱上
            useLayoutStyleOptions: true, //是否使用该布局的样式设置覆盖全局样式设置（当有多个布局可供切换时，此功能可以实现不同布局下整体样式的切换）
            'defaultNodeWidth': '50', //当useLayoutStyleOptions=true时有效，默认的节点宽度
            'defaultNodeHeight': '50',
            defaultNodeBorderWidth: 0, //当useLayoutStyleOptions=true时有效，默认的节点边框粗细（像素）
            defaultNodeColor: 'rgba(238, 178, 94, 1)', //当useLayoutStyleOptions=true时有效，默认的节点背景颜色
            defaultLineShape: 1, //当useLayoutStyleOptions=true时有效，默认的线条样式
          },
          // {
          //   'label': 'tree1',
          //   'layoutName': 'tree',
          //   'layoutClassName': 'seeks-layout-center',
          //   useLayoutStyleOptions: true,
          //   'from': 'top',
          //   'defaultNodeWidth': '30',
          //   'defaultNodeHeight': '100',
          //   'defaultJunctionPoint': 'tb',
          //   'defaultNodeShape': 1,
          //   'defaultLineShape': 4,
          //   'defaultNodeBorderWidth': 0,
          //   'defaultLineColor': 'rgba(0, 186, 189, 1)',
          //   'defaultNodeColor': 'rgba(0, 206, 209, 1)',
          //   'min_per_width': 40,
          //   'max_per_width': 70,
          //   'min_per_height': 200
          // },
          // {
          //   'label': 'tree2',
          //   'layoutName': 'tree',
          //   'layoutClassName': 'seeks-layout-center',
          //   useLayoutStyleOptions: true,
          //   'from': 'left',
          //   'defaultNodeWidth': '100',
          //   'defaultNodeHeight': '30',
          //   'defaultJunctionPoint': 'lr',
          //   'defaultNodeShape': 1,
          //   'defaultLineShape': 3,
          //   'defaultNodeBorderWidth': 0,
          //   'defaultLineColor': '#cccccc',
          //   'defaultNodeColor': '#43a2f1',
          //   'min_per_width': 200,
          //   'max_per_width': 400,
          //   'min_per_height': 40,
          //   'max_per_height': 70
          // }
        ],
      }
    }
  },
  async created(){
    console.log('in created, graph:', this.graph)
    const data = await getNodeEdgeTypes()
    this.node_labels = data.data.node_types
    this.rel_checkList = data.data.edge_types.slice() //拷贝数组
    this.all_rel_type = data.data.edge_types.slice()
  },
  mounted(){
    this.showGraph()
  },
  methods: {
    close(){
      console.log('closed')
      this.isShowNodeMenuPanel = false
      this.allowShowTipsPanel = true //关闭点击打开的菜单时才允许显示tips
    },
    showGraph(query){
      console.log('graph: ', this.graph)
      if(!this.graph || !this.graph.nodes || !this.graph.nodes.length)
        return
      var __graph_json_data = {
        rootId: '',
        nodes: [],
        links: [],
      }
      if(this.graph.edges){
        __graph_json_data.links = this.graph.edges.map((edge) => {
          let item = {
            from: edge.startNodeId + '',
            to: edge.endNodeId + '',
            text: edge.label,
            // linwWidth: 2, //线条粗细（像素）
            // lineColor: 'gray',
            // isHide: false,
            // lineShape: 1, //1:直线/2:样式2/3:样式3/4:折线/5:样式5/6:样式6
            // fontColoe: 'white',
            // showLineLabel: true, //是否显示连线文字
            // isHideArrow: false, //是否显示箭头
            data: {
              ...edge.properties,
              label: edge.label,
            },
          }
          return item
        })
      }
      if(this.graph.nodes){
        __graph_json_data.nodes = this.graph.nodes.map((node) => {
          let item = { //不接受直接添加自定义属性
            id: node.id + '',
            // color: 'blue',
            // fontColor: 'white',
            // borderWidth: 2,
            // borderColor: 'steelblue',
            // nodeShape: 0,
            // width: 200,
            // opacity: 0.8,
            // isHide: false, //是否隐藏这个节点
            // disableDrag: false, //是否禁用节点的拖动功能
            // expandHolderPosition: 'right', //节点展开/关闭按钮位置（left/top/right/bottom）节点的这个设置会覆盖全局的expandHolderPosition设置，即使改节点没有子节点也可以让其显示展开/收缩按钮，可以实现部分节点显示展开/收缩按钮的效果;
            // expanded: true, //手工设置节点的展开收缩状态
            // fixed: false, //是否使用固定位置（以当前图谱左上角为0,0的坐标系）
            // innerHTML: '<span>ttt</span>', //用HTML自定义节点内部的内容，当此属性不为空时，text属性将失效，仅当slot#node不启用时有效
            // html: '<span>ggg</span>', //用HTML自定义节点，当此属性不为空时，节点的所有样式属性将失效，slot node也将无效
            data: {
              ...node.properties, //自定义属性需要放在这里，才能在后续使用中从节点获取
              label: node.label,
            }
          }
          if(node.label == 'user'){
            item.data.text = node.properties.name
          }
          if(node.label == 'image'){
            item.data.label = node.label
            item.opacity = 1
            item.borderWidth = 0
            item.borderColor =  'white'
            item.color = 'white'

            // 不能使用外部组件，也没法注入事件
            item.html = `<img style='width:70px;height:70px;object-fit:cover' src=${node.properties.url}/>`
          }
          else if(node.label == 'domain'){
            item.data.text = node.properties.name
          }
          else{
            item.data.text = node.label
          }
          __graph_json_data.rootId = item.id
          return item
        })
      }
      this.$refs['seeksRelationGraph'].setJsonData(__graph_json_data, (seeksGrpah) => {

      })
    },
    onNodeClick(nodeObject, $event){
      console.log(nodeObject)
      this.allowShowTipsPanel = false //tips不能显示在鼠标位置，不然悬浮时点击不到节点
    },
    onLineClick(lineObject, $event){
      console.log(lineObject)
    },
    showNodeMenus(nodeObject, $event) {
      this.allowShowTipsPanel = false
      this.currentNode = nodeObject
      var _base_position = this.$refs.myPage.getBoundingClientRect()
      // console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeMenuPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y
      // console.log(this.nodeMenuPanelPosition)
    },
    doAction(actionName) {
      this.$notify({
        title: '提示',
        message: '对节点【' + this.currentNode.text + '】进行了：' + actionName,
        type: 'success'
      })
      this.isShowNodeMenuPanel = false
    },
    focus(){
      var graph = this.$refs.seeksRelationGraph
      let id = this.currentNode.id
      graph.focusNodeById(id)
      // graph.getNodeById(id).fontColor = '#000000'
      this.isShowNodeMenuPanel = false
    },
    doFilter() {
      var _all_nodes = this.$refs.seeksRelationGraph.getNodes()
      var _all_lines = this.$refs.seeksRelationGraph.getLines()
      _all_nodes.forEach(thisNode => {
        var _isHideThisLine = false
        if (this.checked_sex !== '') {
          if (thisNode.data['gender'] !== this.checked_sex) {
            _isHideThisLine = true
          }
        }
        if (this.checked_node_type !== '') {
          if (thisNode.data['label'] !== this.checked_node_type) {
            _isHideThisLine = true
          }
        }
        thisNode.opacity = _isHideThisLine ? 0.1 : 1
      })
      _all_lines.forEach(thisLine => {
        // 注意这里的line和json数据中link不一样，一条线（line）上可以附着多条关系(link),可以通过line.relations获取到这条线上所有的关系数据(link)
        var _isHideThisLine = true
        thisLine.relations.forEach(thisLink => {
          if (this.rel_checkList.indexOf(thisLink.data['label']) === -1) {
            thisLink.isHide = true
          } else {
            _isHideThisLine = false
            thisLink.isHide = false
          }
        })
        // thisNode.opacity = _isShowThisNode ? 1 : 0.1
      })
    },
    showNodeTips(nodeObject, $event) {
      if(!this.allowShowTipsPanel) //只有它为true时才在悬浮时显示tips
        return
      this.currentNode = nodeObject
      var _base_position = this.$refs.myPage.getBoundingClientRect()
      console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeTipsPanel = true
      this.nodeMenuPanelPosition.x =  _base_position.x - 50
      this.nodeMenuPanelPosition.y =  _base_position.y + 200
    },
    hideNodeTips(nodeObject, $event) {
      this.isShowNodeTipsPanel = false
    }
  }
}
</script>

<style scoped>
.me-node {
  height:64px;
  line-height: 64px;
  border-radius: 32px;
  cursor: pointer;
}

.c-node-menu-item{
  line-height: 30px;padding-left: 10px;cursor: pointer;color: #444444;font-size: 14px;border-top:#efefef solid 1px;
}
.c-node-menu-item:hover{
  background-color: rgba(66,187,66,0.2);
}

.slot-node {
  height:32;
  line-height: 34px;
  border-radius: 32px;
  cursor: pointer;
}
</style>
