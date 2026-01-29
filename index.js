import { getDictConfigOptions } from '@/api/common';
import { refreshStyles } from 'less';
import { ref } from 'vue';
import axios from 'axios'

/** 围栏类型枚举 */
export const useFenceTypeMap = () => {
  const fenceTypeMap = ref(new Map());
  const updateFenceTypeMap = async () => {
    const data = await getDictConfigOptions('wl_type');
    fenceTypeMap.value = new Map(data?.map((item) => ([Number(item.dictValue), item.dictLabel])) || []);
    console.log('fenceTypeMap', fenceTypeMap.value);
  };
  updateFenceTypeMap();

  return fenceTypeMap;
};

/**  地区选择 */
export const useProvinceCityOptions = () => {

  /** 省市选项 */
  const provinceCityOptions = ref([]);
  const updateAreaOptions = async () => {
    const {data} = await axios.get('/area.json')
    provinceCityOptions.value = data.map((item) => ({
      label: item.name,
      value: item.code,
      children: item.children?.map((child) => ({
        label: child.name,
        value: child.code,
      })) || [],
    })) || [];
  };
  updateAreaOptions();

  return provinceCityOptions;
};
