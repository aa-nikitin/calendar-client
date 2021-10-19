import axios from 'axios';

export const fetchGet = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchPost = async (url, obj) => {
  try {
    const { data } = await axios.post(url, { ...obj });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
