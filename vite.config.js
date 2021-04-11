const path = require('path');

module.exports = {
   build: {
      lib: {
         entry: path.resolve(__dirname, 'src/app.js'),
         name: 'remote_testing'
      },
   }
}
