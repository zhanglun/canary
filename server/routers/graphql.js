const router = require('koa-router')()
const graphqlHTTP = require('koa-graphql');
const { buildSchema } = require('graphql');
const MusicService = require('../services/music');
const musicService = new MusicService();

// 使用 GraphQL schema language 构建一个 schema
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

// root 将会提供每个 API 入口端点的解析函数
const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};
router.all('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

module.exports = router;
