const fs = require('fs').promises;
const path = require('path');

class Store {
  constructor() {
    this.data = null;
    this.path = path.join(__dirname, '../store/data.json');
  }

  async load() {
    const dataJson = await fs.readFile(this.path, { encoding: 'utf8' });
    this.data = JSON.parse(dataJson);
  }

  getData() {
    return this.data;
  }

  async setData(data) {
    this.data = { ...this.data, ...data };
    await fs.writeFile(this.path, JSON.stringify(this.data, null, 2), { encoding: 'utf8' })
  }
}

module.exports = Store;
