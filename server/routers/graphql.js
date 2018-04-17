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
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }
`);

// 该类继承 RandomDie GraphQL 类型
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// root 将会提供每个 API 入口端点的解析函数
const root = {
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  },
};
router.all('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

module.exports = router;
