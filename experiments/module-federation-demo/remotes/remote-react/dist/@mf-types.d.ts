
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/Widget' | 'REMOTE_ALIAS_IDENTIFIER/WebComponent';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/WebComponent' ? typeof import('REMOTE_ALIAS_IDENTIFIER/WebComponent') :T extends 'REMOTE_ALIAS_IDENTIFIER/Widget' ? typeof import('REMOTE_ALIAS_IDENTIFIER/Widget') :any;