## Settings for the S3 bucket:

### Bucket policy:

{
"Version": "2012-10-17",
"Id": "Policy1690144970071",
"Statement": [
{
"Sid": "Stmt1690144967328",
"Effect": "Allow",
"Principal": {
"AWS": "*"
},
"Action": "s3:*",
"Resource": "arn:aws:s3:::import-files-csv/*"
}
]
}

### CORS

[
{
"AllowedHeaders": [
"*"
],
"AllowedMethods": [
"PUT",
"POST",
"DELETE",
"GET"
],
"AllowedOrigins": [
"*"
],
"ExposeHeaders": []
}
]