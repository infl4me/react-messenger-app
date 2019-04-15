import React from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import connect from '../../connect';

const renderField = (props) => {
  const {
    input, type, refLink, placeholder, required,
    meta: { error },
  } = props;
  return (
    <React.Fragment>
      <Form.Control {...input} placeholder={placeholder} required={required} ref={refLink} type={type} autoComplete="off" />
      {error && <div className="text-danger mt-2">{error}</div>}
    </React.Fragment>
  );
};
const renderFooter = (pristine, submitting, handleClose) => (
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button disabled={submitting || pristine} type="submit" variant="primary">
      {submitting ? 'Loading...' : 'Confirm'}
    </Button>
  </Modal.Footer>
);


export default (form, action) => (Wrapped) => {
  @reduxForm({ form })
  @connect()
  class WithModalHandler extends React.Component {
    handleSubmit = (...args) => async (values) => {
      const inputValue = values[form];
      const {
        showAlert, reset, handleClose,
      } = this.props;
      reset();
      try {
        // eslint-disable-next-line react/destructuring-assignment
        await this.props[action](...args, inputValue);
      } catch (e) {
        showAlert({ errorProps: { message: 'Error occurred while processing your request' } });
        throw new SubmissionError({ _error: e.message });
      } finally {
        handleClose();
      }
    }

    render() {
      return (
        <Wrapped
          {...this.props}
          renderFooter={renderFooter}
          handleConfirm={this.handleSubmit}
          renderField={renderField}
        />
      );
    }
  }
  return WithModalHandler;
};
