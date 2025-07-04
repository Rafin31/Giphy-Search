

shopt -s failglob
set -eu -o pipefail

echo "Begin: Setup AWS"


BRANCH="${BITBUCKET_BRANCH:-${GITHUB_REF_NAME:-}}"


if [ "$BRANCH" == "prod" ]; then
  echo "Detected prod branch — installing AWS CLI..."
  curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -qq awscliv2.zip
  ./aws/install -i /usr/local/aws-cli -b /usr/local/bin
fi

echo "Exporting env vars"
export AWS_PROFILE="${AWS_PROFILE:-baseline-webpage}"
echo "AWS Profile: [$AWS_PROFILE]"

export AWS_REGION="${AWS_REGION:-ap-southeast-2}"
echo "AWS Region: [$AWS_REGION]"

export AWS_HOME="/usr/local/bin/aws"
export PATH="${AWS_HOME}:${PATH}"


if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
  if [ "$BRANCH" == "prod" ]; then
    export AWS_ACCESS_KEY_ID="${PROD_AWS_ACCOUNT_ACCESS_KEY_ID:-}"
    export AWS_SECRET_ACCESS_KEY="${PROD_AWS_ACCOUNT_SECRET_ACCESS_KEY:-}"
  else
    export AWS_ACCESS_KEY_ID="${NON_AWS_ACCOUNT_ACCESS_KEY_ID:-}"
    export AWS_SECRET_ACCESS_KEY="${NON_AWS_ACCOUNT_SECRET_ACCESS_KEY:-}"
  fi
fi


if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
  echo "⚠️ Warning: AWS credentials are missing. Deployment may fail."
fi


aws --version || echo "AWS CLI not installed"


aws configure set cli_follow_urlparam false
aws configure set region "$AWS_REGION"


mkdir -p ~/.aws
touch ~/.aws/config
if ! grep -q "\[profile $AWS_PROFILE\]" ~/.aws/config; then
  echo "[profile $AWS_PROFILE]" >> ~/.aws/config
  echo "region=$AWS_REGION" >> ~/.aws/config
else
  echo "Profile [$AWS_PROFILE] already exists in config"
fi

# Apply credentials to selected profile
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" --profile "$AWS_PROFILE"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY" --profile "$AWS_PROFILE"

echo "Current AWS user:"
aws iam get-user || echo "Unable to fetch user (permissions might be limited)"

echo "Finish: Setup AWS"
