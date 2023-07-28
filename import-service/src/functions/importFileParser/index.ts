import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: `import-files-csv`,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploads/'
          }
        ],
        existing: true
      },
    },
  ],
};
