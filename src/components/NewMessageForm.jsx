import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import * as actions from '../actions';
import { withUserName } from './hoc';

const Textarea = field => <Form.Control {...field.input} as="textarea" rows="3" placeholder="Type your message here" />;

const actionCreators = {
  sendMessage: actions.sendMessage,
};

const mapStateToProps = ({ channels: { currentChannelId } }) => ({ currentChannelId });

@withUserName()
@reduxForm({ form: 'newMessage' })
@connect(mapStateToProps, actionCreators)
class NewMessageForm extends React.Component {
  handleSubmit = async (values) => {
    const {
      reset, sendMessage, username, currentChannelId,
    } = this.props;
    try {
      await sendMessage(currentChannelId, { username, ...values });
    } catch (e) {
      throw new SubmissionError({ _error: e.message });
    }
    reset();
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form className="d-flex mt-auto" onSubmit={handleSubmit(this.handleSubmit)}>
        <Field name="message" component={Textarea} />
        <Button variant="secondary" type="submit">Send</Button>
      </Form>
    );
  }
}

export default NewMessageForm;
