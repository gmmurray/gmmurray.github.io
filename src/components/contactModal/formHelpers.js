export const api_url = process.env.GATSBY_EMAILJS_API_URL;
const user_id = process.env.GATSBY_EMAILJS_USER_ID;
const service_id = process.env.GATSBY_EMAILJS_SERVICE_ID;
const template_id = process.env.GATSBY_EMAILJS_TEMPLATE_ID;

export const DEFAULT_FORM_STATE = {
  values: { name: '', email: '', message: '' },
  errors: {
    name: null,
    email: null,
    message: null,
  },
  isSubmitting: false,
  success: false,
  failure: false,
};

// Returns null if no errors exist, else returns an object with keyed errors
export const validateForm = values => {
  const { name, email, message } = values;
  const errors = {
    name: !validRequiredField(name) ? 'Please enter your name' : null,
    email: !validEmail(email) ? 'Please enter a valid email' : null,
    message: !validRequiredField(message) ? 'Please enter your message' : null,
  };

  return Object.keys(errors).every(error => errors[error] === null)
    ? null
    : errors;
};

export const transformFormToRequest = values => {
  const { name: user_name, email: user_email, message: user_message } = values;

  return {
    user_id,
    service_id,
    template_id,
    template_params: {
      user_name,
      user_email,
      user_message,
    },
  };
};

const validRequiredField = field => {
  return field && field.length > 0;
};

const validEmail = email => {
  var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};
