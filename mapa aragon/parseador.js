//parsear keys
export const parseador = (data) => {
  const changeCaseOfKey = (key) => {
    return key.split(' ').join('_');
  };

  const isObject = (o) => {
    return (
      o === Object(o) &&
      !Array.isArray(o) &&
      typeof o !== 'function'
    );
  };

  const parseoKey = (entity) => {
    if (entity === null) return entity;

    if (isObject(entity)) {
      const changedObject = {};
      Object.keys(entity).forEach(
        (originalKey) => {
          const newKey = changeCaseOfKey(
            originalKey
          );
          changedObject[newKey] = parseoKey(
            entity[originalKey]
          );
        }
      );
      return changedObject;
    } else if (Array.isArray(entity)) {
      return entity.map((element) => {
        return parseoKey(element);
      });
    }

    return entity;
  };

  const parseoValues = (data) => {
    const keys = Object.keys(data);
    keys.shift();
    keys.forEach((key) => {
      data[key] = +data[key];
    });
    return data;
  };

  const sourceJson = data;

  const resultKeys = parseoKey(sourceJson);
  const result = parseoValues(resultKeys);
  return result;
};