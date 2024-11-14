class TableStore {
  constructor() {
    // 列配置
    this.columns = [];

    // 数据
    this.data = [];

    // 自定义表头保存的字段
    this.storageKey = [];
  }

  // 设置数据
  setData(data) {
    this.data = data;
  }

  // 设置columns
  setColumns(columns) {
    this.columns = columns;
  }

  // 设置自定义表头的key
  setStorageKey(key) {
    this.storageKey = key;
  }

  // 插入列
  insertColumn(column) {
    const index = this.columns.findIndex((item) => (item.uuid === column.uuid));
    if (index > -1) {
      this.updateColumn(index, column);
    } else {
      this.columns.push(column);
    }
  }

  // 更新列
  updateColumn(index, column) {
    this.columns[index] = (column);
  }

  // 删除列
  deleteColumn(uuid) {
    const index = this.columns.findIndex((item) => (item.uuid === uuid));
    if (index > -1) {
      this.columns.splice(index, 1);
    }
  }
}

export default TableStore;
