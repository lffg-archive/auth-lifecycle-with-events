interface Registry {
  userId: number;
  time: {
    start: number;
    end: number;
  };
  insertedAt: number;
}

const list: Registry[] = [];

export function get() {
  return list;
}

export function insert(registry: Registry) {
  list.push(registry);
}
