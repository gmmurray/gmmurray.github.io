import React, { Component, Fragment } from 'react';
import Axios from 'axios';

export default class ContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      values: {
        name: '',
        email: '',
        message: '',
        _subject: 'Personal Website Message',
        _after: 'https://gregmurray.org',
        _honeypot: '',
      },
      errors: {
        name: '',
        email: '',
        message: '',
      },
      isSubmitting: false,
      isError: false,
    };
    this.baseState = this.state;
  }

  componentDidUpdate() {
    if (this.state.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleInputChange = e => {
    this.setState({
      values: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitForm = e => {
    e.preventDefault();
    this.addValidationMessages();
    if (this.validFields()) {
      this.setState({ isSubmitting: true });
      Axios.post(
        'https://mailthis.to/gregprofessional',
        this.state.values,
      ).then(() => {
        this.setState({ isSubmitting: false });
        window.location.href = 'https://mailthis.to/confirm';
      });
    }
  };

  addValidationMessages = () => {
    this.setState({
      errors: {
        name: !this.checkRequired(this.state.values.name)
          ? 'Please enter your name'
          : '',
        email: !this.checkEmail() ? 'Please enter a valid email' : '',
        message: !this.checkRequired(this.state.values.message)
          ? 'Please enter your message'
          : '',
      },
    });
  };

  validFields = () => {
    return (
      this.checkEmail() &&
      this.checkRequired(this.state.values.name) &&
      this.checkRequired(this.state.values.email) &&
      this.checkRequired(this.state.values.message)
    );
  };

  checkEmail = () => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.state.values.email).toLowerCase());
  };

  checkRequired = field => {
    if (field.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  cancelForm = () => {
    this.setState(this.baseState);
    this.props.toggleModal();
  };

  render() {
    return (
      <Fragment>
        <div
          className={`modal ${
            this.state.open ? 'is-active animated fadeIn' : ''
          }`}
        >
          <div className="modal-background"></div>
          <div className="modal-card">
            <button
              className="modal-close is-large"
              onClick={this.props.toggleModal}
              aria-label="close"
            ></button>
            <header className="modal-card-head">
              <p className="modal-card-title font-dark-blue">
                Send me an email
              </p>
              <button
                className="delete"
                onClick={this.props.toggleModal}
                aria-label="close"
              ></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={this.submitForm}>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label font-yellow" htmlFor="name">
                      Your name
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
                          value={this.state.values.name}
                          onChange={this.handleInputChange}
                        />
                      </p>
                      <p className="help is-danger">{this.state.errors.name}</p>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label font-yellow" htmlFor="email">
                      Your email
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
                          value={this.state.values.email}
                          onChange={this.handleInputChange}
                        />
                      </p>
                      <p className="help is-danger">
                        {this.state.errors.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label font-yellow" htmlFor="message">
                      Your message
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
                          value={this.state.values.message}
                          onChange={this.handleInputChange}
                        />
                      </p>
                      <p className="help is-danger">
                        {this.state.errors.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className={`button is-link font-dark-blue ${
                        this.state.isSubmitting ? 'is-loading' : ''
                      }`}
                      type="submit"
                    >
                      Send message
                    </button>
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-link is-outlined"
                      onClick={() => this.cancelForm()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </Fragment>
    );
  }
}
