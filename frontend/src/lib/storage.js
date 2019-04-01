const getData = (key, parse = true) => {
  let data = localStorage.getItem(key);
  if (data && data !== '') {
    try {
      if (parse) {
        data = JSON.parse(data);
      }
    } catch (error) {
      console.log('data can\'t parse json');
    }
  }

  return data;
}

const setData = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  localStorage.setItem(key, val);
}

export default {
  setData,
  getData
}