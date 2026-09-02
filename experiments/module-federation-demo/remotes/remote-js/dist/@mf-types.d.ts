
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/Widget';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/Widget' ? typeof import('REMOTE_ALIAS_IDENTIFIER/Widget') :any;