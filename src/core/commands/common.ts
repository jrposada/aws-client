export type SendParams = {
    profileName: string;
};

export type Result<TData = unknown> = {
    success: boolean;
    data: TData;
};
