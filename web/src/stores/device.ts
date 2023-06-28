import { defineStore } from 'pinia';
import i18n from '@/i18n';
import type IDeviceInfo from '@/ts/interface/IDeviceInfo';
import * as api from '@/api/apiService';

interface IDeviceStoreState {
    deviceList: IDeviceInfo[];
    isMqttConnected: boolean;
}

export const useDeviceStore = defineStore('device', {
    state(): IDeviceStoreState {
        return {
            deviceList: [],
            isMqttConnected: true,
        };
    },
    actions: {
        // 更新设备列表
        updateDeviceList(list: IDeviceInfo[]) {
            this.deviceList = list;
        },
        // 获取设备列表
        async getDeviceList() {
            try {
                const response = await api.getDevices();
                console.log('获取设备列表结果：', response);
                if (response.error !== 0) {
                    if (response.error === 603) {
                        this.updateIsMqttConnected(false);
                    }
                    return;
                }
                this.updateDeviceList(response.data.map((item) => ({ ...item, syncing: false })));
            } catch (error) {
                console.log('获取设备列表出错：', error);
            }
        },
        // 更新mqtt链接状态
        updateIsMqttConnected(connected: boolean) {
            this.isMqttConnected = connected;
        },
    },
    persist: true,
});