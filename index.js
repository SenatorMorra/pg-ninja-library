import pg from "pg-ninja";

export { pg as PG_Ninja };

export default function postgres_library(lib, db) {
  const result = {};

  for (const key in lib) {
    if (lib.hasOwnProperty(key)) {
      if (typeof lib[key] === "string") {
        result[key] = {
          value: lib[key],
          query: async function (binds) {
            let responce = db.query(this.value, binds);
            return responce;
          },
        };
      } else if (Array.isArray(lib[key])) {
        result[key] = {
          value: lib[key],
          transaction: async function (binds) {
            let responce = db.transaction(this.value, binds);
            return responce;
          },
        };
      } else if (typeof lib[key] === "object") {
        result[key] = postgres_library(lib[key], db);
      }
    }
  }

  result.end = () => {
    return db.end();
  };

  return result;
}
