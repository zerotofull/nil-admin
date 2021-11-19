import {defineStore} from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            sidebar: {
                opened: true,
                withoutAnimation: false
            },
            device: 'desktop'
        }
    },
    getters: {
        getSidebar: state => state.sidebar,
        getDevice: state => state.device,
    },
    actions: {
        toggleSideBar() {
            this.sidebar.opened = !this.sidebar.opened
            this.sidebar.withoutAnimation = false
            // if (state.sidebar.opened) {
            //     Cookies.set('sidebarStatus', 1)
            // } else {
            //     Cookies.set('sidebarStatus', 0)
            // }
        },
        closeSideBar({withoutAnimation}) {
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
        },
        toggleDevice(device) {
            this.device = device
        }
    },
})