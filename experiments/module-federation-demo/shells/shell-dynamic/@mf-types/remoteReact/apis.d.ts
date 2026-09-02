
    export type RemoteKeys = 'remoteReact/Widget' | 'remoteReact/WebComponent';
    type PackageType<T> = T extends 'remoteReact/WebComponent' ? typeof import('remoteReact/WebComponent') :T extends 'remoteReact/Widget' ? typeof import('remoteReact/Widget') :any;