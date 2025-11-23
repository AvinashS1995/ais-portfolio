export const VALIDATION_MESSAGES: any = {
  fullName: {
    required: 'Full Name is required.',
    minlength: 'Full Name is too short.',
  },
  username: {
    required: 'Username is required.',
    uniqueError: 'Username already in use!',
  },
  slug: {
    required: 'Slug is required.',
    uniqueError: 'Slug already exists!',
  },
  email: {
    required: 'Email is required.',
    email: 'Email is invalid.',
  },
  password: {
    required: 'Password is required.',
    minlength: 'Password must be at least 6 characters.',
  },
  phone: {
    required: 'Phone number is required.',
    pattern: 'Phone number is invalid.',
  },
  role: {
    required: 'Role is required.',
  },
};
