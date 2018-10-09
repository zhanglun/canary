<style lang="less">
</style>

<template>
  <v-app light>
<v-navigation-drawer
      v-model="menuVisible"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon @click="menuVisible = !menuVisible"></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">链家二手房</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
    <v-content>
      <data-table></data-table>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>
<script>
import dataTable from './table';

export default {
  name: 'lianjia',
  components: {
    dataTable,
  },
  data() {
    return {
      menuVisible: false,
    };
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>

