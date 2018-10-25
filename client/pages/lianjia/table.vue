<template>
  <v-container fluid>
    <v-layout row
              wrap
              >
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
      </v-flex>

      <v-flex xs2>
        <v-select
                  v-model="city"
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
        <input type="hidden" name="city" :value="city">
      </form>
      <form ref="downloadChengjiaoForm"
            target="_blank"
            method="post"
            action="/api/lianjia/chengjiao/export">
        <input type="hidden" name="city" :value="city">
      </form>
      <form ref="downloadXiaoquForm"
            target="_blank"
            method="post"
            action="/api/lianjia/xiaoqu/export">
        <input type="hidden" name="city" :value="city">
      </form>
    </v-layout>
    <v-layout row
              wrap
              align-center>
      <v-card>
        <!-- <v-card-title>
        Nutrition
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title> -->
        <v-data-table v-model="selected"
                      :headers="headers"
                      :items="list"
                      :pagination.sync="pagination"
                      select-all
                      item-key="hid"
                      class="elevation-1">
          <template slot="headers"
                    slot-scope="props">
            <tr>
              <th>
                <v-checkbox :input-value="props.all"
                            :indeterminate="props.indeterminate"
                            primary
                            hide-details
                            @click.native="toggleAll"></v-checkbox>
              </th>
              <th v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)">
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items"
                    slot-scope="props">
            <!-- <tr :active="props.selected" @click="props.expanded = !props.expanded"> -->
            <tr :active="props.selected">
              <td>
                <v-checkbox :input-value="props.selected"
                            primary
                            hide-details></v-checkbox>
              </td>
              <!-- <td>
              <v-icon @click="props.expanded = !props.expanded" v-if="!props.expanded">expand_more</v-icon>
              <v-icon @click="props.expanded = !props.expanded" v-if="props.expanded">expand_less</v-icon>
            </td> -->
              <td @click="props.expanded = !props.expanded">{{ props.item.title }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="text-xs-right">{{ props.item.origin_url }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="text-xs-right">{{ props.item.price_total }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="text-xs-right">{{ props.item.unit_price }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="">{{ props.item.community_name }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="">{{ props.item.area_name }}</td>
              <td @click="props.expanded = !props.expanded"
                  class="">{{ props.item.input_time }}</td>
            </tr>
          </template>
          <template slot="expand"
                    slot-scope="props">
            <v-card flat>
              <v-card-text>Peek-a-boo!</v-card-text>
            </v-card>
          </template>
        </v-data-table>
        <!-- <div class="text-xs-center pt-2">
        <v-pagination v-model="pageManger.page" :length="pageManger.pages" @input="handlePageChange"></v-pagination>
      </div> -->
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
            name: '北京',
            value: 'bj',
          },
          {
            name: '杭州',
            value: 'hz',
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
        list: [],
        pageManger: {
          page: 2,
          pages: 15,
        },

        city: 'bj',
      };
    },

    watch: {
      city() {
        this.getList();
      }
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
        return axios.get('/api/lianjia/ershoufang', options).then((res) => {
          let { data } = res;

          this.list = data;
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
        this.loading3 =true;

        setTimeout(() => {
          this.$refs.downloadChengjiaoForm.submit();
          this.loading3 = false;
        }, 300);
      },

      handleExportXiaoqu() {
        this.loading4 =true;

        setTimeout(() => {
          this.$refs.downloadXiaoquForm.submit();
          this.loading4 = false;
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
