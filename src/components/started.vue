<template>
  <div class="page-x">
    <!-- 【步骤1】 创建容器 -->
    <div class="g6-x" id="containerG6" ref="containerG6"></div>
    <button @click="changeLayout2circle">环形布局</button>
    <button @click="changeLayout2force">力导布局(需要计算一定时间）</button>
    <button @click="changeLayout2fruchterman">fruchterman布局</button>
  </div>
</template>

<script>
// 【步骤2】 引入G6
import G6 from '@antv/g6'

export default {
  name: "started",
  data() {
    return {
      graph: null,
      // 【步骤3】 准备数据
    }
  },
  methods: {
    changeLayout2fruchterman() {
      this.graph.updateLayout("fruchterman")
    },
    changeLayout2circle(){
      this.graph.updateLayout("circular")
    },
    changeLayout2force(){
      this.graph.updateLayout('force2')
    },
    // 初始化关系图，并渲染数据
    async main() {
      let containerG6  = this.$refs.containerG6 // 获取容器（DOM元素）
      let minimap = new G6.Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate',
      });
      // 实例化 Image Minimap 插件
      const imageMinimap = new G6.ImageMinimap({
        width: 200,
        graphImg: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ'
      });
      this.graph = new G6.Graph({
        // ...                   // 图的其他配置
        // fitView:true,
        plugins: [minimap],  // 将 map 实例配置到图上
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node',
          ],
        },
        //图的交互
        nodeStateStyles: {
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            fill: 'red',
          },
          // 鼠标点击节点，即 click 状态为 true 时的样式
          click: {
            stroke: '#000',
            lineWidth: 3,
          },
        },
        // 边不同状态下的样式集合
        edgeStateStyles: {
          // 鼠标点击边，即 click 状态为 true 时的样式
          click: {
            stroke: 'steelblue',
          },
        },
        //设置图的布局
        layout: {
          type: 'grid',
          begin: [ 0, 0 ],          // 可选，
          preventOverlap: true,     // 可选，必须配合 nodeSize
          preventOverlapPdding: 20, // 可选
          nodeSize: 30,             // 可选
          condense: false,          // 可选
          rows: 5,                  // 可选
          cols: 5,                  // 可选
          sortBy: 'degree'          // 可选

        },
        container: containerG6, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: containerG6.offsetWidth, // Number，必须，图的宽度
        height: containerG6.offsetHeight, // Number，必须，图的高度
        // 节点在默认状态下的样式配置（style）和其他配置
        defaultNode: {
          size: 30, // 节点大小
          // ...                 // 节点的其他配置
          // 节点样式配置
          style: {
            fill: 'blue', // 节点填充色
            stroke: '#666', // 节点描边色
            lineWidth: 1, // 节点描边粗细
          },
          // 节点上的标签文本配置
          labelCfg: {
            // 节点上的标签文本样式配置
            style: {
              fill: '#fff', // 节点标签文字颜色
            },
          },
        },
        // 边在默认状态下的样式配置（style）和其他配置
        defaultEdge: {
          // ...                 // 边的其他配置
          // 边样式配置
          style: {
            opacity: 0.6, // 边透明度
            stroke: 'red', // 边描边颜色
          },
          // 边上的标签文本配置
          labelCfg: {
            autoRotate: true, // 边上的标签文本根据边的方向旋转
          },
        },
      })

      let response = await fetch(
          'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
      );
      let remoteData = await response.json();
      this.graph.data(remoteData); // 加载远程数据

      // 遍历图中边并设置样式
      let edges = remoteData.edges;
      edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        // edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
      });
      this.graph.render(); // 渲染
      //鼠标进入节点
      this.graph.on('node:mouseenter', (e) => {
        const nodeItem = e.item // 获取鼠标进入的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true

      })
      // 鼠标离开节点
      this.graph.on('node:mouseleave', (e) => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
        console.log('鼠标离开')
      });

      // 点击节点
      this.graph.on('node:click', (e) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        let clickNodes = this.graph.findAllByState('node', 'click');
        clickNodes.forEach((cn) => {
          this.graph.setItemState(cn, 'click', false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        this.graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
      });
      // 点击边
      this.graph.on('edge:click', (e) => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = this.graph.findAllByState('edge', 'click');
        clickEdges.forEach((ce) => {
          this.graph.setItemState(ce, 'click', false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        this.graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
      });


    }
  },
  mounted() {
    this.main()
    //this.initGraph()


  }
};
</script>

<style scoped>
.g6-x {
  float: left;
  width: 60%;
  height: 600px;
  border: 1px solid #ccc;
  margin-left: 20px;
}

</style>