const Model = require('./model');

class Car extends Model {
  static table() {
    return 'cars';
  }

  constructor() {
    super();
    this.fields = ['id', 'user_id', 'model', 'year'];
  }
}

module.exports = Car;
