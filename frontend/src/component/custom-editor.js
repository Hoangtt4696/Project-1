import React, { Component } from 'react';
import { Col } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  handleEditorStateChange: PropTypes.func.isRequired,
  content: PropTypes.object
}

class CustomEditor extends Component {
  render() {
    const {title, handleEditorStateChange, content} = this.props;
    return (
      <Col span={15} style={{ paddingRight: 10 }}>
        <p style={{fontWeight: 'bold'}}>{title}</p>
        <Editor
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          placeholder="Nội dung..."
          editorState={content}
          onEditorStateChange={handleEditorStateChange}/>
      </Col>
    )
  }
}

CustomEditor.propTypes = propTypes;

export default CustomEditor;