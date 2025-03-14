import {defineStore} from "pinia";
import {ref} from "vue";
import {v4 as uuid} from "uuid";

export interface NotificationMessage {
    id: string,
    message: string,
    title?: string,
    type: "info" | "error" | "success" | "warning"
}

export const useNotificationStore = defineStore('notification',
    () => {
        const messages = ref<NotificationMessage[]>([]);

        function add(
            message: string,
            type: "info" | "error" | "success" | "warning" = "info",
            title?: string,
            timeout: number = 5000,
        ) {
            const id = uuid();
            messages.value.push({
                id,
                message,
                title,
                type
            })
            if (timeout > 0) {
                setTimeout(() => {
                    remove(id);
                }, timeout);
            }
        }

        function remove(id: string) {
            messages.value = messages.value.filter((i) => i.id !== id)
        }

        function info(message: string, title?: string, timeout?: number) {
            add(message, "info", title, timeout);
        }

        function error(message: string, title?: string, timeout?: number) {
            add(message, "error", title, timeout);
        }

        function success(message: string, title?: string, timeout?: number) {
            add(message, "success", title, timeout);
        }

        function warning(message: string, title?: string, timeout?: number) {
            add(message, "warning", title, timeout);
        }

        return {
            messages,
            add,
            remove,
            info,
            error,
            success,
            warning
        }
    });
