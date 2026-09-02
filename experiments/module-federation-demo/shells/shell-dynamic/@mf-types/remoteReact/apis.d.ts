
    export type RemoteKeys = 'remoteReact/Widget';
    type PackageType<T> = T extends 'remoteReact/Widget' ? typeof import('remoteReact/Widget') :any;