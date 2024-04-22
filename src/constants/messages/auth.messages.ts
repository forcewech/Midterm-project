export const authMessages = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  USERNAME_OR_PASSWORD_IS_INCORRECT: 'Username or password is incorrect',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_IS_INVALID: 'Username is invalid',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  CONFIRM_PASSWORD_MUST_BE_A_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exists',
  LOGOUT_SUCCESS: 'logout success',
  USER_NOT_FOUND: 'User not found',
  GET_ACCESS_TOKEN_AND_REFRESH_TOKEN_SUCCESS: 'Get access token and refresh token success',
  INVITE_ID_NOT_FOUND: 'Invite id not found',
  INVITE_ID_IS_INACTIVE: 'Invite id is inactive',
  INVITE_ID_IS_REQUIRED: 'Invite id is required',
  YOUR_ACCOUNT_IS_CURRENTLY_INACTIVE: 'Your account is currently inactive',
  FORBIDDEN_ACCESS_DENIED: 'Forbidden Access denied',
  EMAIL_ALREADY_EXISTS: 'Email already exists'
} as const
