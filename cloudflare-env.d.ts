declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ERP_IMPORT_KEY?: string;
    ERP_WORKSPACE_EMAIL?: string;
    ERP_WORKSPACE_ID?: string;
    BUCKET?: R2Bucket;
  }
}
