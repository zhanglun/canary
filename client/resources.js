export default [
  {
    name: '3Dmol',
    version: '4.0.0',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/1.3.0/3Dmol-min.js',
    inject: 'head',
    cb: () => {
      console.log('3Dmol loaded!');
    },
  },
  {
    name: 'react',
    version: '16.2.0',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/umd/react.production.min.js',
    inject: 'body',
    cb: () => {
      console.log('react loaded!');
    },
  },
];
