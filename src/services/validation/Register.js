import * as Yup from 'yup';

export const RegisterValidationSchema = Yup.object({
    first_name: Yup.string()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be at most 50 characters')
    .matches(/^[A-Za-z]+$/, 'First name should only contain letters')
    .when('otp_register', {
      is: false,
      then: (schema) => schema.required('First name is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
    .required('Password is required'),

  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});
