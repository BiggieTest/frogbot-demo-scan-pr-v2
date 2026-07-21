provider "aws" {
  region = "us-east-1"
}

# IaC: publicly readable S3 bucket, no encryption, no versioning
resource "aws_s3_bucket" "public_bucket" {
  bucket = "frogbot-demo-public-bucket"
  acl    = "public-read"
}

resource "aws_s3_bucket_public_access_block" "public_bucket" {
  bucket                  = aws_s3_bucket.public_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# IaC: SSH / RDP open to the internet
resource "aws_security_group" "wide_open" {
  name = "frogbot-demo-wide-open"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IaC: unencrypted RDS with hardcoded password
resource "aws_db_instance" "demo" {
  identifier          = "frogbot-demo-db"
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  username            = "admin"
  password            = "P@ssw0rd_super_secret_123"
  storage_encrypted   = false
  publicly_accessible = true
  skip_final_snapshot = true
}
