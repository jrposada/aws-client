export type RdsData = {
    cluster_arn: string;
    database: string;
    query: string;
    secret_arn: string;
};

export type RdsResult = Record<string, string>[];
