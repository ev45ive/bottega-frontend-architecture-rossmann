
    export type RemoteKeys = 'remoteJs/Widget';
    type PackageType<T> = T extends 'remoteJs/Widget' ? typeof import('remoteJs/Widget') :any;