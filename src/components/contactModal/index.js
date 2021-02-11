import React, { useCallback, useState } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import {
  api_url,
  DEFAULT_FORM_STATE,
  transformFormToRequest,
  validateForm,
} from './formHelpers';
import Message, { messageTypes } from './message';

const ContactModal = ({
  open,
  toggleModal,
  title,
  nameLabel,
  emailLabel,
  messageLabel,
  submitText,
  successTitle,
  failureTitle,
  successText,
  failureText,
}) => {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);

  const handleInputChange = useCallback(
    e => {
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          [e.target.name]: e.target.value,
        },
      });
    },
    [formState, setFormState],
  );

  const submitForm = useCallback(
    e => {
      e.preventDefault();
      const errors = validateForm(formState.values);
      if (errors) {
        setFormState({
          ...formState,
          errors,
        });
        return;
      }
      setFormState({ ...formState, isSubmitting: true });
      Axios({
        method: 'post',
        url: api_url,
        data: { ...transformFormToRequest(formState.values) },
      })
        .then(res => {
          if (res.status === 200) {
            setFormState({ ...DEFAULT_FORM_STATE, success: true });
          } else {
            setFormState({ ...formState, success: false, failure: true });
          }
        })
        .catch(err => {
          setFormState({ ...formState, success: false, failure: true });
          console.log(err);
        });
    },
    [formState, setFormState],
  );

  const cancelForm = useCallback(() => {
    setFormState(DEFAULT_FORM_STATE);
    toggleModal();
  }, [toggleModal, setFormState]);

  const modal_cn = `modal ${open ? 'is-active animated fadeIn' : ''}`;
  const submitButton_cn = `button is-link font-dark-blue ${
    formState.isSubmitting ? 'is-loading' : ''
  }`;
  return (
    <div className={modal_cn}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <button
          className="modal-close is-large"
          onClick={toggleModal}
          aria-label="close"
        ></button>
        <header className="modal-card-head">
          <p className="modal-card-title font-dark-blue">{title}</p>
          <button
            className="delete"
            onClick={toggleModal}
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          {formState.success && (
            <Message
              title={successTitle}
              message={successText}
              type={messageTypes.success}
            />
          )}
          {formState.failure && (
            <Message
              title={failureTitle}
              message={failureText}
              type={messageTypes.failure}
            />
          )}
          <form onSubmit={submitForm}>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label font-yellow" htmlFor="name">
                  {nameLabel}
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      id="name"
                      name="name"
                      value={formState.values.name}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p className="help is-danger">{formState.errors.name}</p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label font-yellow" htmlFor="email">
                  {emailLabel}
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      id="email"
                      name="email"
                      value={formState.values.email}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p className="help is-danger">{formState.errors.email}</p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label font-yellow" htmlFor="message">
                  {messageLabel}
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <textarea
                      className="textarea"
                      type="text"
                      id="message"
                      name="message"
                      value={formState.values.message}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p className="help is-danger">{formState.errors.message}</p>
                </div>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className={submitButton_cn} type="submit">
                  {submitText}
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-link is-outlined"
                  onClick={cancelForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  nameLabel: PropTypes.string.isRequired,
  emailLabel: PropTypes.string.isRequired,
  messageLabel: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
  successTitle: PropTypes.string.isRequired,
  failureTitle: PropTypes.string.isRequired,
  successText: PropTypes.string.isRequired,
  failureText: PropTypes.string.isRequired,
};

export default ContactModal;
