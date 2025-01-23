# (NOT YET IMPLEMENTED) Sign in with Apple Setup Guide

## Prerequisites

1. Apple Developer Account with Sign in with Apple enabled
2. The following environment variables in your `.env`:
    ```env
    APPLE_KEY_ID="key_id_from_apple_developer_console"
    APPLE_TEAM_ID="team_id_from_apple_developer_account"
    APPLE_PRIVATE_KEY="private_key_from_downloaded_key_file"
    APPLE_CLIENT_ID="service_id_from_apple_developer_console"
    ```

## Generating Apple Client Secret

1. **Prepare Private Key**

    - Your private key must be in PKCS#8 PEM format:

    ```
    -----BEGIN PRIVATE KEY-----
    MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg+s07GnQqhW5GUzMB
    ... (your key content) ...
    KyQIhAM5mrwGzF+ODHVWDbqsh9ozR9zq7YtVqnxB97XZACBc
    -----END PRIVATE KEY-----
    ```

    - If using environment variable, ensure the key:
        1. Includes the BEGIN and END markers
        2. Has proper newline characters (`\n`)
        3. Is properly escaped

    Example .env format:

    ```env
    APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGTAgEA...\n-----END PRIVATE KEY-----"
    ```

2. **Run Generation Script**

    You can provide the private key in two ways:

    **Option 1: Direct in command**

    ```bash
    node src/scripts/apple-gen-secret.js \
      --kid "$APPLE_KEY_ID" \
      --iss "$APPLE_TEAM_ID" \
      --sub "$APPLE_CLIENT_ID" \
      --private_key "$APPLE_PRIVATE_KEY"
    ```

3. **Save Generated Secret**
    - Copy the generated JWT
    - Add it to your `.env`:
    ```env
    APPLE_SECRET="eyJhbGciOiJFUzI1N...generated_jwt"
    ```

## Script Options

-   `--expires_in`: Custom expiration time in seconds (default: 6 months)
-   `--expires_in 999999999`: Set a very long expiration (~31.7 years)
-   `--exp`: Specific expiration timestamp
-   `--help`: Show all available options

## Important Notes

-   The secret expires after 6 months by default
-   Keep your private key and generated secret secure
-   Set a reminder to regenerate the secret before expiration
-   The script requires Node.js 18+ for the Web Crypto API

## Troubleshooting

Common issues and solutions:

1. **Invalid Private Key Format**

    - Ensure proper newline escaping with `\n`
    - Verify key begins with `-----BEGIN PRIVATE KEY-----`

2. **JWT Generation Fails**

    - Check all environment variables are set
    - Verify Apple Developer account permissions
    - Ensure Key ID matches the private key

3. **Authentication Fails**
    - Verify the generated secret in Apple Developer console
    - Check service ID configuration
    - Confirm redirect URIs are properly set

For more details, see:

-   [NextAuth.js Apple Provider docs](https://next-auth.js.org/providers/apple)
-   [Apple Sign in docs](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)
