import axiosClient from "../utils/axiosClient";


export const getShopRecordsByDate = (date) =>
  axiosClient.get(`/shop/manage/records`, {
    params: { date }
  });


export const createShopRecord = (payload) =>
  axiosClient.post(`/shop/manage/records`, payload);


export const updateShopRecord = (id, payload) =>
  axiosClient.patch(`/shop/manage/records/${id}`, payload);


export const deleteShopRecord = (id) =>
  axiosClient.delete(`/shop/manage/records/${id}`);

export const getCropList = () => {
  return axiosClient.get(`/crop/list`);
};

export const searchFarmers = (search="")=>{

     return axiosClient.get("/shop/manage/list", {
        params: {search}
     }); 
}; 





