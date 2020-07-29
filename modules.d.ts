declare namespace NodeJS {
  export interface ProcessEnv {
    UPLOADS_URL: string;
    ITEMS_URL: string;
    STORAGE_TYPE: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_DEFAULT_REGION: string;
    AWS_BUCKET: string;
  }
}
