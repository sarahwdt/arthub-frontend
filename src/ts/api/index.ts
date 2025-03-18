import {Ref} from "vue";
import {useNotificationStore} from "@/ts/stores/notification";

const notifications = useNotificationStore();

declare interface ProblemDetails {
    title: string | null;
    status: number;
    detail: string | null;
    instance: string | null;
    properties: any[];
}

export function catchFieldErrors<TResult>(fields: {}, global?: Ref<any>): ((err: any) => TResult | PromiseLike<TResult>) {
    return (err: any) => {
        if (!err.response) throw err;
        const {status, data} = err.response;
        if (status === 422 && data && data["errors"]) {
            for (let field of Object.keys(data["errors"])) {
                if (fields[field] && data["errors"][field] instanceof Array && data["errors"][field].length > 0) {
                    fields[field].setErrors(data["errors"][field].join(", "));
                }
            }
        }
        if (status === 422 && data && !!data["objectErrors"] && data["objectErrors"] instanceof Array && !!global) {
            global.value = data["objectErrors"].join(", ");
        }
        throw err;
    }
}

export function notifyError(): ((err: any) => never) {
    return (err: any) => {
        if (err.response) {
            const {data} = err.response;
            const {title, detail} = data;
            if (!!detail) {
                notifications.error(detail, title)
            }
        }
        throw err;
    }
}

export function suppressError(): ((err: any) => void) {
    return (err: any) => {
    }
}
