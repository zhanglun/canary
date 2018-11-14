<template>
  <v-container fluid>
    <v-layout row
              wrap>
      <v-flex xs4>
        <v-btn color="success"
               :loading="loading"
               :disabled="loading"
               @click.native="handleExportAll">导出全部</v-btn>
        <v-btn color="primary"
               :loading="loading2"
               :disabled="true"
               @click.native="handleExportSelected">导出选中</v-btn>
        <v-btn color="primary"
               :loading="loading3"
               :disabled="loading3"
               @click.native="handleExportChengjiao">导出成交信息</v-btn>
        <v-btn color="primary"
               :loading="loading4"
               :disabled="loading4"
               @click.native="handleExportXiaoqu">导出小区信息</v-btn>
        <v-btn color="primary"
               :loading="loading5"
               :disabled="loading5"
               @click.native="handleExportZufang">导出租房信息</v-btn>
      </v-flex>

      <v-flex xs2>
        <v-select v-model="city"
                  :items="citys"
                  item-text="name"
                  item-value="value"
                  label="选择城市"
                  solo></v-select>
      </v-flex>
      <form ref="downloadForm"
            target="_blank"
            method="post"
            action="/api/lianjia/ershoufang/export">
        <input type="hidden"
               name="city"
               :value="city">
      </form>
      <form ref="downloadChengjiaoForm"
            target="_blank"
            method="post"
            action="/api/lianjia/chengjiao/export">
        <input type="hidden"
               name="city"
               :value="city">
      </form>
      <form ref="downloadXiaoquForm"
            target="_blank"
            method="post"
            action="/api/lianjia/xiaoqu/export">
        <input type="hidden"
               name="city"
               :value="city">
      </form>
      <form ref="downloadZufangForm"
            target="_blank"
            method="post"
            action="/api/lianjia/zufang/export">
        <input type="hidden"
               name="city"
               :value="city">
      </form>
    </v-layout>
    <v-layout row
              wrap
              align-center>
      <v-card>
        {{overviews}}
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'TableFixed',
    data: () => {
      return {
        pagination: {
          sortBy: 'name',
        },
        citys: [
          {
            value: 'cz',
            name: '滁州',
          },
          {
            value: 'hf',
            name: '合肥',
          },
          {
            value: 'bj',
            name: '北京',
          },
          {
            value: 'cq',
            name: '重庆',
          },
          {
            value: 'fz',
            name: '福州',
          },
          {
            value: 'ly',
            name: '龙岩',
          },
          {
            value: 'quanzhou',
            name: '泉州',
          },
          {
            value: 'xm',
            name: '厦门',
          },
          {
            value: 'zhangzhou',
            name: '漳州',
          },
          {
            value: 'dg',
            name: '东莞',
          },
          {
            value: 'fs',
            name: '佛山',
          },
          {
            value: 'gz',
            name: '广州',
          },
          {
            value: 'hui',
            name: '惠州',
          },
          {
            value: 'qy',
            name: '清远',
          },
          {
            value: 'sz',
            name: '深圳',
          },
          {
            value: 'zh',
            name: '珠海',
          },
          {
            value: 'zhanjiang',
            name: '湛江',
          },
          {
            value: 'zs',
            name: '中山',
          },
          {
            value: 'gy',
            name: '贵阳',
          },
          {
            value: 'bh',
            name: '北海',
          },
          {
            value: 'huangshi',
            name: '黄石',
          },
          {
            value: 'hg',
            name: '黄冈',
          },
          {
            value: 'wh',
            name: '武汉',
          },
          {
            value: 'xy',
            name: '襄阳',
          },
          {
            value: 'xn',
            name: '咸宁',
          },
          {
            value: 'yichang',
            name: '宜昌',
          },
          {
            value: 'cs',
            name: '长沙',
          },
          {
            value: 'changde',
            name: '常德',
          },
          {
            value: 'zhuzhou',
            name: '株洲',
          },
          {
            value: 'bd',
            name: '保定',
          },
          {
            value: 'chengde',
            name: '承德',
          },
          {
            value: 'hd',
            name: '邯郸',
          },
          {
            value: 'hs',
            name: '衡水',
          },
          {
            value: 'lf',
            name: '廊坊',
          },
          {
            value: 'qhd',
            name: '秦皇岛',
          },
          {
            value: 'sjz',
            name: '石家庄',
          },
          {
            value: 'xt',
            name: '邢台',
          },
          {
            value: 'zjk',
            name: '张家口',
          },
          {
            value: 'bt',
            name: '保亭',
          },
          {
            value: 'cm',
            name: '澄迈',
          },
          {
            value: 'dz',
            name: '儋州',
          },
          {
            value: 'da',
            name: '定安',
          },
          {
            value: 'hk',
            name: '海口',
          },
          {
            value: 'lg',
            name: '临高',
          },
          {
            value: 'ld',
            name: '乐东',
          },
          {
            value: 'ls',
            name: '陵水',
          },
          {
            value: 'qh',
            name: '琼海',
          },
          {
            value: 'qz',
            name: '琼中',
          },
          {
            value: 'san',
            name: '三亚',
          },
          {
            value: 'wzs',
            name: '五指山',
          },
          {
            value: 'wc',
            name: '文昌',
          },
          {
            value: 'wn',
            name: '万宁',
          },
          {
            value: 'kf',
            name: '开封',
          },
          {
            value: 'luoyang',
            name: '洛阳',
          },
          {
            value: 'xinxiang',
            name: '新乡',
          },
          {
            value: 'xc',
            name: '许昌',
          },
          {
            value: 'zz',
            name: '郑州',
          },
          {
            value: 'hrb',
            name: '哈尔滨',
          },
          {
            value: 'ha',
            name: '淮安',
          },
          {
            value: 'nj',
            name: '南京',
          },
          {
            value: 'nt',
            name: '南通',
          },
          {
            value: 'su',
            name: '苏州',
          },
          {
            value: 'wx',
            name: '无锡',
          },
          {
            value: 'xz',
            name: '徐州',
          },
          {
            value: 'zj',
            name: '镇江',
          },
          {
            value: 'cc',
            name: '长春',
          },
          {
            value: 'nc',
            name: '南昌',
          },
          {
            value: 'sr',
            name: '上饶',
          },
          {
            value: 'dl',
            name: '大连',
          },
          {
            value: 'sy',
            name: '沈阳',
          },
          {
            value: 'hhht',
            name: '呼和浩特',
          },
          {
            value: 'yinchuan',
            name: '银川',
          },
          {
            value: 'sh',
            name: '上海',
          },
          {
            value: 'cd',
            name: '成都',
          },
          {
            value: 'dy',
            name: '德阳',
          },
          {
            value: 'dazhou',
            name: '达州',
          },
          {
            value: 'leshan',
            name: '乐山',
          },
          {
            value: 'mianyang',
            name: '绵阳',
          },
          {
            value: 'ms',
            name: '眉山',
          },
          {
            value: 'nanchong',
            name: '南充',
          },
          {
            value: 'jn',
            name: '济南',
          },
          {
            value: 'qd',
            name: '青岛',
          },
          {
            value: 'wf',
            name: '潍坊',
          },
          {
            value: 'weihai',
            name: '威海',
          },
          {
            value: 'yt',
            name: '烟台',
          },
          {
            value: 'zb',
            name: '淄博',
          },
          {
            value: 'xa',
            name: '西安',
          },
          {
            value: 'xianyang',
            name: '咸阳',
          },
          {
            value: 'jz',
            name: '晋中',
          },
          {
            value: 'ty',
            name: '太原',
          },
          {
            value: 'tj',
            name: '天津',
          },
          {
            value: 'dali',
            name: '大理',
          },
          {
            value: 'km',
            name: '昆明',
          },
          {
            value: 'xsbn',
            name: '西双版纳',
          },
          {
            value: 'hz',
            name: '杭州',
          },
          {
            value: 'jx',
            name: '嘉兴',
          },
          {
            value: 'nb',
            name: '宁波',
          },
          {
            value: 'sx',
            name: '绍兴',
          },
        ],
        selected: [],
        headers: [
          {
            text: '标题',
            align: 'left',
            value: 'title',
          },
          { text: '网页源地址', value: 'origin_url' },
          { text: '总价(万)', value: 'price_total' },
          { text: '单价(万)', value: 'unit_price' },
          { text: '楼盘', value: 'community_name' },
          { text: '板块', value: 'area_name' },
          { text: '录入时间', value: 'input_time' },
        ],

        loading: false,
        loading2: false,
        loading3: false,
        loading4: false,
        loading5: false,
        overviews: {},
        pageManger: {
          page: 2,
          pages: 15,
        },

        city: 'bj',
      };
    },

    watch: {
      // city() {
      //   this.getList();
      // },
    },

    methods: {
      toggleAll() {
        if (this.selected.length) {
          this.selected = [];
        } else {
          this.selected = this.list.slice();
        }
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      request(options = {}) {
        return axios.get('/api/lianjia/overviews', options).then((res) => {
          let { data } = res;

          this.overviews = data;
        });
      },

      handlePageChange(page) {
        this.pageManger.page = page;
        this.getList();
      },

      getList() {
        let options = {
          params: {
            // page: this.pageManger.page,
            page_size: 100000,
            city: this.city,
          },
        };

        return this.request(options);
      },

      handleExportAll() {
        this.loading = true;

        setTimeout(() => {
          this.$refs.downloadForm.submit();
          this.loading = false;
        }, 300);
      },

      handleExportChengjiao() {
        this.loading3 = true;

        setTimeout(() => {
          this.$refs.downloadChengjiaoForm.submit();
          this.loading3 = false;
        }, 300);
      },

      handleExportXiaoqu() {
        this.loading4 = true;

        setTimeout(() => {
          this.$refs.downloadXiaoquForm.submit();
          this.loading4 = false;
        }, 300);
      },
      handleExportZufang() {
        this.loading5 = true;

        setTimeout(() => {
          this.$refs.downloadZufangForm.submit();
          this.loading5 = false;
        }, 300);
      },

      handleExportSelected() {},
    },
    created() {},
    mounted() {
      this.getList();
    },
  };
</script>
